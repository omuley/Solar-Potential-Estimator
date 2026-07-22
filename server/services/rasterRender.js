import { fromArrayBuffer } from "geotiff";
import { PNG } from "pngjs";
import proj4 from "proj4";

proj4.defs(
    "EPSG:32616",
    "+proj=utm +zone=16 +datum=WGS84 +units=m +no_defs"
  );

export async function imageToRaster(annualFluxUrl) {
    // code goes here
  
    const response = await fetch(
      `${annualFluxUrl}&key=${process.env.GOOGLE_API_KEY}`
    );

  
    if (!response.ok) {
      throw new Error("Unable to download GeoTIFF for annual");
    }

    const arrayBuffer = await response.arrayBuffer();

    const tiff = await fromArrayBuffer(arrayBuffer); //tell geoTiff library to open file
    const image = await tiff.getImage();
    const bbox = image.getBoundingBox();
    const raster = await image.readRasters(); //read every pixel value
  
    const width = image.getWidth();
    const height = image.getHeight();

    const [minX, minY, maxX, maxY] = bbox;

    const [west, south] = proj4(
        "EPSG:32616",
        "EPSG:4326",
        [minX, minY]
    )   ;

    const [east, north] = proj4(
        "EPSG:32616",
        "EPSG:4326",
        [maxX, maxY]    
    );

    const imageBounds = [
        [south, west],
        [north, east]
    ];

    console.log(imageBounds);

    return {
        width,
        height,
        raster,
        imageBounds
    };
  
  }

  export async function rasterRender(raster, width, height) {
    const values = raster[0];

    let min = Infinity;
    let max = -Infinity;

    for (const value of values) {
        if (value < min) min = value;
        if (value > max) max = value;
    }


    //make blank png
    const png = new PNG({
        width,
        height
    });

    for (let i = 0; i < values.length; i++) {

        const value = values[i];
  
      //every pixel stores 4 values!
  
            const normalizedValue = (value - min) / (max - min);
            const color = getColor(normalizedValue);
            const idx = i * 4; //every pixel stores 4 values!
            png.data[idx] = color.r;
            png.data[idx + 1] = color.g;
            png.data[idx + 2] = color.b;
            png.data[idx + 3] = 255; //highest opacity

   

    }

    const buffer = PNG.sync.write(png);
    return buffer;

  }

  function getColor(normalizedValue) {
    if(normalizedValue < 0.2) { //blue

        const t = normalizedValue / 0.2;

        return {
            r: interpolate(0,0,t),
            g: interpolate(0,255,t),
            b: interpolate(255,255,t)
        };

    } else if(normalizedValue < 0.4) { //cyan

        const t = (normalizedValue - 0.2) / 0.2;

        return {
            r: 0,
            g: 225,
            b: interpolate(225,0,t)
        };

    } else if(normalizedValue < 0.6) {
 //green
        const t = (normalizedValue - 0.4) / 0.2;

        return {
            r: interpolate(0,225,t),
            g: 225,
            b: 0
        };

    } else if(normalizedValue < 0.8) { //yellow

        const t = (normalizedValue - 0.6) / 0.2;

        return {
            r: 225,
            g: interpolate(225,165,t),
            b: 0
        };
        

    } else { //red

        const t = (normalizedValue - 0.8) / 0.2;

        return {
            r: 225,
            g: interpolate(165,0,t),
            b: 0
        };

    }

  }

  function interpolate(start, end, t) {
    return Math.round(
        start + (end - start) * t
    );
}