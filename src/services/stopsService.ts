import { api } from "../api/axios";
// import type { Route } from "../types";

export async function getStops() {
  const res = await api.get("/api/stops");
  return res.data.stops;
}

export async function getStopById(stopId: string) {
  const res = await api.get(`/api/stops/${stopId}`);
  return res.data.timetables;
}

export async function getStopTimetables(stopId: string, directionId?: number) {
  let endpoint = `/api/stops/${stopId}/timetables`;

  if (directionId !== null) {
    endpoint += `?directionId=${directionId}`;
  }

  const res = await api.get(endpoint);
  return res.data;
}
