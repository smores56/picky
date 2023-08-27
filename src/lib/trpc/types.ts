import { z } from "zod";

export const ZodNewAddress = z.object({
  lineOne: z.string(),
  lineTwo: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  phoneNumber: z.string(),
  latitude: z.number(),
  longitude: z.number()
});

export const ZodNewHours = z.array(z.object({
    startingHour: z.number(),
    startingMinute: z.number(),
    endingHour: z.number(),
    endingMinute: z.number()
}));

export const ZodCoordinates = z.object({
  latitude: z.number(),
  longitude: z.number()
});

export interface OpenCageAddressComponents {
  city: string,
  country: string,
  house_number?: string,
  postcode: string,
  road: string,
  state: string,
  state_code: string
}

export interface OpenCageResponse {
  results: OpenCageResult[],
  status: {
    code: number,
    message: string
  }
}

export interface OpenCageResult {
  components: OpenCageAddressComponents,
  confidence: number,
  formatted: string,
  geometry: {
    lat: number,
    lng: number
  }
}
