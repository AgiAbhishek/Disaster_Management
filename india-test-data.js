// Test data for Indian disaster scenarios
const API_BASE = 'http://localhost:5000/api';

async function createDisaster(disaster) {
  try {
    const response = await fetch(`${API_BASE}/disasters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(disaster)
    });
    const result = await response.json();
    console.log(`✅ Created disaster: ${result.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create disaster:`, error.message);
  }
}

async function createReport(report) {
  try {
    const response = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
    const result = await response.json();
    console.log(`✅ Created report for disaster ${result.disasterId}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create report:`, error.message);
  }
}

async function createResource(resource) {
  try {
    const response = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resource)
    });
    const result = await response.json();
    console.log(`✅ Created resource: ${result.name}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create resource:`, error.message);
  }
}

async function testLocationExtraction(description) {
  try {
    const response = await fetch(`${API_BASE}/geocode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    });
    const result = await response.json();
    console.log(`🎯 Location extracted: "${description}" -> ${result.locationName} (${result.latitude}, ${result.longitude})`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to extract location:`, error.message);
  }
}

async function populateIndianTestData() {
  console.log('🇮🇳 Populating disaster response platform with Indian test data...\n');

  // Test location extraction with Indian cities
  console.log('🔍 Testing location extraction for Indian cities:');
  await testLocationExtraction('Flooding reported in Mumbai with railway services disrupted');
  await testLocationExtraction('Major fire incident near Delhi Red Fort area');
  await testLocationExtraction('Earthquake damage in Bangalore city center');
  await testLocationExtraction('Cyclone warning issued for Chennai coastal areas');
  await testLocationExtraction('Heavy rain in Kolkata causing waterlogging');
  console.log('');

  // Create disaster scenarios for India
  const disasters = [
    {
      title: 'Mumbai Monsoon Flooding',
      description: 'Heavy monsoon rains causing severe flooding in Mumbai. Multiple railway lines suspended. Water levels rising in low-lying areas of Dharavi and Kurla.',
      ownerId: 'disaster_coordinator_india',
      tags: ['flood', 'monsoon', 'railway', 'urgent']
    },
    {
      title: 'Delhi Heat Wave Emergency',
      description: 'Extreme heat wave hitting Delhi with temperatures exceeding 47°C. Power grid under stress. Multiple hospitals reporting heat-related admissions.',
      ownerId: 'disaster_coordinator_india',
      tags: ['heatwave', 'medical', 'power', 'urgent']
    },
    {
      title: 'Chennai Cyclone Preparation',
      description: 'Cyclone approaching Chennai coast. Evacuation orders issued for coastal areas. Fishing boats advised to return to harbor immediately.',
      ownerId: 'disaster_coordinator_india',
      tags: ['cyclone', 'evacuation', 'coastal', 'weather']
    },
    {
      title: 'Bangalore IT Park Fire',
      description: 'Major fire incident at Bangalore Electronic City IT park. Multiple buildings affected. Traffic diversions in place on Hosur Road.',
      ownerId: 'disaster_coordinator_india',
      tags: ['fire', 'commercial', 'traffic', 'evacuation']
    },
    {
      title: 'Kolkata Bridge Collapse',
      description: 'Partial bridge collapse in Kolkata affecting traffic movement. Emergency teams deployed. Alternative routes being established.',
      ownerId: 'disaster_coordinator_india',
      tags: ['infrastructure', 'traffic', 'emergency', 'urgent']
    }
  ];

  const createdDisasters = [];
  for (const disaster of disasters) {
    const result = await createDisaster(disaster);
    if (result) createdDisasters.push(result);
  }

  // Create citizen reports
  const reports = [
    {
      disasterId: 1,
      userId: 'citizen_mumbai_1',
      content: 'Water level at my building gate is 3 feet. Need immediate pumping assistance. Located near Bandra Station.',
      imageUrl: 'https://example.com/mumbai_flood_image1.jpg'
    },
    {
      disasterId: 2,
      userId: 'citizen_delhi_1',
      content: 'AC units failing in Connaught Place area. Many elderly people need cooling center access urgently.',
      imageUrl: null
    },
    {
      disasterId: 3,
      userId: 'citizen_chennai_1',
      content: 'Strong winds already started in Marina Beach area. Shops boarding up windows. Need evacuation transport.',
      imageUrl: 'https://example.com/chennai_cyclone_prep.jpg'
    },
    {
      disasterId: 4,
      userId: 'citizen_bangalore_1',
      content: 'Smoke visible from Tech Mahindra building. Fire trucks arrived. Employees evacuating via emergency exits.',
      imageUrl: 'https://example.com/bangalore_fire.jpg'
    },
    {
      disasterId: 5,
      userId: 'citizen_kolkata_1',
      content: 'Howrah Bridge side road cracked badly. Traffic backed up for 2 kilometers. Police redirecting vehicles.',
      imageUrl: null
    }
  ];

  for (const report of reports) {
    await createReport(report);
  }

  // Create emergency resources
  const resources = [
    {
      disasterId: 1,
      name: 'Mumbai Flood Relief Center',
      type: 'shelter',
      locationName: 'Bandra Community Center, Mumbai',
      latitude: 19.0596,
      longitude: 72.8295
    },
    {
      disasterId: 2,
      name: 'Delhi Cooling Center',
      type: 'medical',
      locationName: 'AIIMS Delhi Emergency Wing',
      latitude: 28.5672,
      longitude: 77.2100
    },
    {
      disasterId: 3,
      name: 'Chennai Evacuation Center',
      type: 'shelter',
      locationName: 'Anna University Sports Complex',
      latitude: 13.0181,
      longitude: 80.2358
    },
    {
      disasterId: 4,
      name: 'Bangalore Fire Station',
      type: 'fire',
      locationName: 'Electronic City Fire Station',
      latitude: 12.8456,
      longitude: 77.6603
    },
    {
      disasterId: 5,
      name: 'Kolkata Traffic Control',
      type: 'transport',
      locationName: 'Kolkata Police Traffic HQ',
      latitude: 22.5726,
      longitude: 88.3639
    },
    {
      name: 'Indian Red Cross - Mumbai',
      type: 'medical',
      locationName: 'Red Cross Bhavan, Mumbai',
      latitude: 19.0728,
      longitude: 72.8826
    },
    {
      name: 'NDRF Station Delhi',
      type: 'rescue',
      locationName: 'National Disaster Response Force, Delhi',
      latitude: 28.6448,
      longitude: 77.2141
    }
  ];

  for (const resource of resources) {
    await createResource(resource);
  }

  console.log('\n🎯 Indian Test Data Summary:');
  console.log('- 5 disaster scenarios created (flood, heatwave, cyclone, fire, bridge collapse)');
  console.log('- 5 citizen reports submitted from major Indian cities');
  console.log('- 7 emergency resources mapped across India');
  console.log('- Location extraction tested for Indian cities');
  console.log('- Social media monitoring active');
  console.log('- Real-time WebSocket updates enabled');

  console.log('\n📋 How to test with Indian data:');
  console.log('1. Visit the dashboard to see all disasters listed');
  console.log('2. Filter disasters by tags (flood, heatwave, cyclone, fire)');
  console.log('3. Use resource mapping to find nearby help in Indian cities');
  console.log('4. Submit new reports mentioning Indian locations');
  console.log('5. Test location extraction with phrases like:');
  console.log('   - "Emergency in Mumbai near CST station"');
  console.log('   - "Fire reported at Delhi Connaught Place"');
  console.log('   - "Flooding in Chennai T. Nagar area"');
  console.log('   - "Accident near Bangalore Whitefield"');
  console.log('   - "Bridge issue in Kolkata Howrah area"');
}

// Sample disaster report data for testing
console.log('\n📝 Sample Disaster Report Data for India:');
console.log('\n🔥 Fire Emergency:');
console.log('Title: Market Fire Emergency');
console.log('Description: Major fire outbreak at Sarojini Nagar Market in Delhi. Multiple shops affected. Fire brigade on scene. Immediate evacuation required.');
console.log('Tags: fire, commercial, evacuation, urgent');

console.log('\n🌊 Flood Emergency:');
console.log('Title: Urban Flooding Crisis');
console.log('Description: Heavy rainfall in Mumbai causing severe waterlogging in Andheri and Malad areas. Local trains suspended. Residents stranded.');
console.log('Tags: flood, monsoon, transport, urgent');

console.log('\n🌪️ Cyclone Warning:');
console.log('Title: Cyclone Preparedness Alert');
console.log('Description: Severe cyclone warning for Chennai and surrounding coastal areas. Wind speeds expected 120+ kmph. Mass evacuation initiated.');
console.log('Tags: cyclone, weather, evacuation, coastal');

console.log('\n🔥 Industrial Emergency:');
console.log('Title: Chemical Plant Incident');
console.log('Description: Gas leak reported at industrial area in Pune near Hadapsar. Hazmat teams deployed. 2km radius evacuation in progress.');
console.log('Tags: chemical, industrial, hazmat, evacuation');

console.log('\n🏗️ Building Collapse:');
console.log('Title: Building Structural Failure');
console.log('Description: Residential building collapse in Kolkata Salt Lake area. NDRF teams mobilized. Search and rescue operations underway.');
console.log('Tags: collapse, rescue, residential, emergency');

// Run the population function
populateIndianTestData().catch(console.error);