export async function solarService(lat, long) {
    // code goes here
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = 'https://solar.googleapis.com/v1/buildingInsights:findClosest' +
   `?location.latitude=${lat}` +
   `&location.longitude=${long}` +
   `&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    //get info
    if (!data.solarPotential) {
        console.error("No solar potential found");
        return {
            maxCount: null,
            maxSunshine: null
            
          };
    }

    return {
        panelConfigs: data.solarPotential.solarPanelConfigs,
        maxCount: data.solarPotential.maxArrayPanelsCount
        
      };
  
}

export async function rasterService(lat, long) {
  // code goes here
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = 'https://solar.googleapis.com/v1/dataLayers:get' +
 `?location.latitude=${lat}` +
 `&location.longitude=${long}` +
 `&radiusMeters=50` +
  `&view=FULL_LAYERS` +
  `&requiredQuality=HIGH` +
  `&exactQualityRequired=true`+
  `&pixelSizeMeters=0.25` +
  `&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();
  //get info
  if (!response.ok) {
    throw new Error(`Google Solar API returned ${response.status}`);
}
  return {
    annualFluxUrl: data.annualFluxUrl,
    };

}
