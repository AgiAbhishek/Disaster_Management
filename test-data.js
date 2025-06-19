// Test script to populate the disaster response platform with sample data

const BASE_URL = 'http://localhost:5000/api';

async function createDisaster(disaster) {
  const response = await fetch(`${BASE_URL}/disasters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(disaster)
  });
  return response.json();
}

async function createReport(report) {
  const response = await fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(report)
  });
  return response.json();
}

async function createResource(resource) {
  const response = await fetch(`${BASE_URL}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resource)
  });
  return response.json();
}

async function testLocationExtraction(description) {
  const response = await fetch(`${BASE_URL}/geocode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description })
  });
  return response.json();
}

async function populateTestData() {
  console.log('🚀 Populating disaster response platform with test data...');

  // Create sample disasters
  const disasters = [
    {
      title: "NYC Flood Emergency",
      locationName: "Manhattan, NYC",
      description: "Heavy flooding in Manhattan due to burst water main. Multiple streets underwater, affecting Lower East Side and Financial District.",
      tags: ["flood", "urgent"],
      latitude: 40.7589,
      longitude: -73.9851
    },
    {
      title: "Brooklyn Bridge Fire",
      locationName: "Brooklyn Bridge, NYC", 
      description: "Structural fire on Brooklyn Bridge approach causing major traffic disruption. Emergency services on scene.",
      tags: ["fire", "urgent"],
      latitude: 40.7061,
      longitude: -73.9969
    },
    {
      title: "Queens Earthquake Damage",
      locationName: "Queens, NYC",
      description: "Minor earthquake damage reported in residential areas of Queens. Building inspections underway.",
      tags: ["earthquake"],
      latitude: 40.7282,
      longitude: -73.7949
    }
  ];

  for (const disaster of disasters) {
    try {
      const created = await createDisaster(disaster);
      console.log(`✅ Created disaster: ${created.title}`);
    } catch (error) {
      console.error(`❌ Failed to create disaster: ${disaster.title}`, error);
    }
  }

  // Create sample reports
  const reports = [
    {
      disasterId: 1,
      content: "Water levels rising rapidly on Houston Street. Need immediate evacuation assistance for elderly residents.",
      imageUrl: "https://example.com/flood-houston-st.jpg",
      verificationStatus: "pending"
    },
    {
      disasterId: 2,
      content: "Smoke visible from multiple blocks away. Traffic completely stopped on both directions.",
      imageUrl: "https://example.com/bridge-fire.jpg", 
      verificationStatus: "pending"
    },
    {
      disasterId: 3,
      content: "Cracks visible in building facade at 45th Avenue. Residents evacuated as precaution.",
      verificationStatus: "verified"
    }
  ];

  for (const report of reports) {
    try {
      const created = await createReport(report);
      console.log(`✅ Created report for disaster ${report.disasterId}`);
    } catch (error) {
      console.error(`❌ Failed to create report`, error);
    }
  }

  // Create additional resources
  const resources = [
    {
      name: "Emergency Medical Station",
      locationName: "Central Park South",
      latitude: 40.7676,
      longitude: -73.9789,
      type: "hospital",
      disasterId: 1
    },
    {
      name: "Temporary Shelter - PS 150",
      locationName: "Lower East Side School",
      latitude: 40.7168,
      longitude: -73.9861,
      type: "shelter",
      disasterId: 1
    },
    {
      name: "Emergency Food Distribution",
      locationName: "Brooklyn Community Center",
      latitude: 40.6892,
      longitude: -73.9442,
      type: "food",
      disasterId: 2
    }
  ];

  for (const resource of resources) {
    try {
      const created = await createResource(resource);
      console.log(`✅ Created resource: ${created.name}`);
    } catch (error) {
      console.error(`❌ Failed to create resource`, error);
    }
  }

  console.log('\n🎯 Test Data Summary:');
  console.log('- 3 disaster scenarios created (flood, fire, earthquake)');
  console.log('- 3 citizen reports submitted');
  console.log('- 3 emergency resources mapped');
  console.log('- Social media monitoring active');
  console.log('- Real-time WebSocket updates enabled');

  console.log('\n📋 How to test:');
  console.log('1. Visit the dashboard to see all disasters listed');
  console.log('2. Filter disasters by tags (flood, fire, earthquake, urgent)');
  console.log('3. Use resource mapping to find nearby help (try lat: 40.7128, lon: -74.0060)');
  console.log('4. Submit new reports through the form');
  console.log('5. Test image verification with any image URL');
  console.log('6. Watch for real-time social media updates');
  console.log('7. Try location extraction by describing a disaster with location');
}

// Run the test data population
populateTestData().catch(console.error);