import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export interface WebSocketMessage {
  type: 'disaster_updated' | 'social_media_updated' | 'resources_updated' | 'report_updated';
  data: any;
}

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('WebSocket client connected');
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send connection confirmation
      this.sendToClient(ws, {
        type: 'resources_updated',
        data: { message: 'Connected to disaster response hub' }
      });
    });
  }

  private sendToClient(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        this.clients.delete(ws);
      }
    }
  }

  broadcast(message: WebSocketMessage) {
    const deadClients: WebSocket[] = [];
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        this.sendToClient(client, message);
      } else {
        deadClients.push(client);
      }
    });

    // Clean up dead connections
    deadClients.forEach(client => this.clients.delete(client));
  }

  broadcastDisasterUpdate(disaster: any) {
    this.broadcast({
      type: 'disaster_updated',
      data: disaster
    });
  }

  broadcastSocialMediaUpdate(post: any) {
    this.broadcast({
      type: 'social_media_updated', 
      data: post
    });
  }

  broadcastResourcesUpdate(resource: any) {
    this.broadcast({
      type: 'resources_updated',
      data: resource
    });
  }

  broadcastReportUpdate(report: any) {
    this.broadcast({
      type: 'report_updated',
      data: report
    });
  }
}

let webSocketService: WebSocketService;

export function initializeWebSocket(server: Server): WebSocketService {
  webSocketService = new WebSocketService(server);
  return webSocketService;
}

export function getWebSocketService(): WebSocketService {
  return webSocketService;
}
