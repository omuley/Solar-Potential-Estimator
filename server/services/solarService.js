export async function solarService(lat, long) {
    // code goes here
    const apiKey = process.env.GOOGLE_API_KEY;
    const url = 'https://solar.googleapis.com/v1/buildingInsights:findClosest' +
   `?location.latitude=${lat}` +
   `&location.longitude=${long}` +
   `&key=${apiKey}`;

   console.log(url);
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

    const sP = data.solarPotential;
    return {
        panelConfigs: sP.solarPanelConfigs,
        maxCount: sP.maxArrayPanelsCount
        
      };
  
}