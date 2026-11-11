import { api } from "../api/axios";
// import type { Route } from "../types";

export async function getStopById(stopId: string) {
  const res = await api.get(`/api/stops/${stopId}`);
  return res.data.timetables;
}

export async function getStopTimetables(stopId: string) {
  const res = await api.get(`/api/stops/${stopId}/timetables`);
  return res.data;
}
