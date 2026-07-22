import { prisma } from '../prisma/prisma.js';


export async function getCachedEstimate(
    latitude,
    longitude,
    monthlyBill,
    monthlyEnergy,
  ) {
    return await prisma.solarApiCache.findUnique({
      where: {
        latitude_longitude_monthlyBill_monthlyEnergy: {
          latitude,
          longitude,
          monthlyBill,
          monthlyEnergy,
        },
      },
    });
  }

  export async function saveEstimate(
    latitude,
    longitude,
    monthlyBill,
    monthlyEnergy,
    result,
    imageKey,
    imageBounds
  ) {
    return await prisma.solarApiCache.create({
      data: {
        latitude,
        longitude,
        monthlyBill,
        monthlyEnergy,
        result,
        imageKey,
        imageBounds
      },
    });
  }