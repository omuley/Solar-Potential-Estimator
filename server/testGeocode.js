import dotenv from "dotenv";
// import { geocodeAddress } from "./services/geocodingService.js";
import {rasterService } from "./services/solarService.js";
import {imageToRaster} from "./services/rasterRender.js";
import {rasterRender} from "./services/rasterRender.js";
import {uploadImage} from "./services/rasterStorage.js";
import {generateSignedUrl} from "./services/rasterStorage.js";
import {randomUUID } from "crypto";

dotenv.config();


const lat = 42.269815;
const long = -87.990755;


const filename = `renders/${randomUUID()}.png`;
const anuual = await rasterService(lat, long);  
const rasterDims = await imageToRaster(anuual.annualFluxUrl);
const buffer = await rasterRender(rasterDims.raster, rasterDims.width, rasterDims.height);

await uploadImage(buffer, filename)
const imageUrl = await generateSignedUrl(filename);

console.log(imageUrl);
