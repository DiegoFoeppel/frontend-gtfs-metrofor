import { api } from "../api/axios";
import type { Route } from "../types";

export async function check() {
  const res = await api.get("/api/routes/health");
  console.log("res", res);
  return res.data;
}

export async function getRoutes(): Promise<Route[]> {
  const res = await api.get("/api/routes");

  console.log("res", res);
  return res.data.geojson;
}

export async function getRoutesAndStops() {
  const res = await api.get(`/api/routes/stops`);
  return res.data;
}

export async function getRouteById(routeId: string) {
  const res = await api.get(`/api/route/${routeId}`);
  return res.data.route;
}

export async function getStopsByRouteId(routeId: string) {
  const res = await api.get(`/api/stops/${routeId}/routes`);
  return res.data.stops;
}
