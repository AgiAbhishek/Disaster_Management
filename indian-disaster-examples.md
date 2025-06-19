# Sample Disaster Report Data for India Testing

## How to Test the Platform

1. **Go to the dashboard** and click "Report New Disaster"
2. **Use these exact examples** for testing (copy and paste):

---

## 🔥 Fire Emergency Example

**Title:** `Market Fire Emergency`

**Location Name:** `Delhi`

**Description:** `Major fire outbreak at Sarojini Nagar Market in Delhi. Multiple shops affected. Fire brigade on scene. Immediate evacuation required for surrounding residential areas.`

**Tags:** `fire, commercial, evacuation, urgent`

---

## 🌊 Flood Emergency Example

**Title:** `Mumbai Monsoon Crisis`

**Location Name:** `Mumbai`

**Description:** `Heavy rainfall in Mumbai causing severe waterlogging in Andheri and Malad areas. Local trains suspended between Andheri and Borivali. Residents stranded on rooftops.`

**Tags:** `flood, monsoon, transport, urgent`

---

## 🌪️ Cyclone Warning Example

**Title:** `Chennai Coastal Alert`

**Location Name:** `Chennai`

**Description:** `Severe cyclone warning for Chennai and surrounding coastal areas. Wind speeds expected 120+ kmph. Mass evacuation initiated from Marina Beach and nearby areas.`

**Tags:** `cyclone, weather, evacuation, coastal`

---

## 🏭 Industrial Emergency Example

**Title:** `Chemical Plant Incident`

**Location Name:** `Pune`

**Description:** `Gas leak reported at industrial area in Pune near Hadapsar. Hazmat teams deployed. 2km radius evacuation in progress. Air quality monitoring active.`

**Tags:** `chemical, industrial, hazmat, evacuation`

---

## 🏗️ Building Collapse Example

**Title:** `Building Structural Failure`

**Location Name:** `Kolkata`

**Description:** `Residential building collapse in Kolkata Salt Lake area. NDRF teams mobilized. Search and rescue operations underway. 50+ residents evacuated from adjacent buildings.`

**Tags:** `collapse, rescue, residential, emergency`

---

## 🌡️ Heat Wave Example

**Title:** `Extreme Heat Alert`

**Location Name:** `Delhi`

**Description:** `Extreme heat wave hitting Delhi with temperatures exceeding 47°C. Power grid under stress. Multiple hospitals reporting heat-related admissions. Cooling centers opened.`

**Tags:** `heatwave, medical, power, urgent`

---

## How to Test Location Extraction

Try these descriptions in the **Location Extraction Test** (if you find that feature):

1. `Emergency situation in Mumbai near CST station`
2. `Fire reported at Delhi Connaught Place`
3. `Flooding in Chennai T Nagar area`
4. `Accident near Bangalore Whitefield`
5. `Bridge collapse in Kolkata Howrah area`

---

## Testing Reports

After creating a disaster, you can add reports using these examples:

**For Mumbai Flood:**
- `Water level at my building gate is 3 feet. Need immediate pumping assistance. Located near Bandra Station.`

**For Delhi Fire:**
- `Smoke visible from multiple blocks away. Traffic completely stopped in both directions on Ring Road.`

**For Chennai Cyclone:**
- `Strong winds already started in Marina Beach area. Shops boarding up windows. Need evacuation transport for elderly residents.`

---

## Important Notes

- **Always fill in the Location Name field** - this is required for the system to work properly
- **Use major Indian city names** like Mumbai, Delhi, Chennai, Bangalore, Kolkata, Pune, Hyderabad
- **The system will automatically find coordinates** for these well-known cities
- **Tags help with filtering** - use relevant disaster type tags

This should resolve the "Unable to extract location" error you were getting!