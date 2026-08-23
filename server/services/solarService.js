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
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

    for (const segment of data.solarPotential.roofSegmentStats) {
      const box = segment.boundingBox;

      minLat = Math.min(minLat, box.sw.latitude);
      maxLat = Math.max(maxLat, box.ne.latitude);

      minLon = Math.min(minLon, box.sw.longitude);
      maxLon = Math.max(maxLon, box.ne.longitude);

    }
    const overallBoundingBox = {
      sw: {
          latitude: minLat,
          longitude: minLon
      },
      ne: {
          latitude: maxLat,
          longitude: maxLon
      }
  };
  

    return {
        panelConfigs: data.solarPotential.solarPanelConfigs,
        maxCount: data.solarPotential.maxArrayPanelsCount,
        maxDims: getBoundingBoxDimensions(overallBoundingBox)
      };
  
}

export async function rasterService(lat, long, maxDims) {
  // code goes here
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = 'https://solar.googleapis.com/v1/dataLayers:get' +
 `?location.latitude=${lat}` +
 `&location.longitude=${long}` +
 `&radiusMeters=${maxDims}` +
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

function getBoundingBoxDimensions(boundingBox) {
  const { sw, ne } = boundingBox;

  const latMeters = (ne.latitude - sw.latitude) * 111320;

  const lonMeters =
    (ne.longitude - sw.longitude) *
    111320 *
    Math.cos((sw.latitude * Math.PI) / 180);

    const maxDimension = Math.max(latMeters, lonMeters);

    const radiusMeters = (maxDimension / 2) * 1.2;

  return radiusMeters;
}