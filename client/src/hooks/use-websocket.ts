import { useEffect, useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './use-toast';

interface WebSocketMessage {
  type: 'disaster_updated' | 'social_media_updated' | 'resources_updated' | 'report_updated';
  data: any;
}

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const socket = new WebSocket(wsUrl);
      websocketRef.current = socket;

      socket.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        
        // Clear any pending reconnection
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'disaster_updated':
              queryClient.invalidateQueries({ queryKey: ['/api/disasters'] });
              queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
              if (!message.data.deleted) {
                toast({
                  title: "Disaster Updated",
                  description: `${message.data.title || 'A disaster record'} has been updated`,
                });
              }
              break;
              
            case 'social_media_updated':
              queryClient.invalidateQueries({ queryKey: ['/api/social-media'] });
              // Show notification for new social media posts
              toast({
                title: "New Social Media Report",
                description: "A new social media report has been detected",
                className: "animate-slide-in"
              });
              break;
              
            case 'resources_updated':
              queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
              if (message.data.message !== 'Connected to disaster response hub') {
                toast({
                  title: "Resource Updated",
                  description: `${message.data.name || 'A resource'} has been updated`,
                });
              }
              break;
              
            case 'report_updated':
              queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
              queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
              toast({
                title: "New Report",
                description: "A new report has been submitted",
              });
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      socket.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect WebSocket...');
          connect();
        }, 3000);
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setIsConnected(false);
      
      // Retry connection after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  return {
    isConnected,
    socket: websocketRef.current
  };
}
