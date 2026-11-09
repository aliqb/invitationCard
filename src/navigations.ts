import { asset } from "./config";

export interface NavigationApp {
  id: string;
  title: string;
  image: string;
  resolver: (lat: string, long: string) => string;
}

export const NAV_APPS: NavigationApp[] = [
  {
    id: "maps",
    title: "maps",
    image: asset("navs/maps.png"),
    resolver: (lat, long) => `https://www.google.com/maps?daddr=${lat},${long}`,
  },
  {
    id: "waze",
    title: "waze",
    image: asset("navs/waze.png"),
    resolver: (lat, long) =>
      `https://www.waze.com/livemap?ll=${lat},${long}&navigate=yes`,
  },
  {
    id: "neshan",
    title: "نشان",
    image: asset("navs/neshan.png"),
    resolver: () => `https://nshn.ir/87rbvsWjOx4aSr`,
  },
  {
    id: "balad",
    title: "بلد",
    image: asset("navs/balad.png"),
    resolver: (lat, long) =>
      `https://balad.ir/location?latitude=${lat}&longitude=${long}&zoom=16.500000`,
  },
];
