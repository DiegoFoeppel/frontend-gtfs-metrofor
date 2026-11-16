import { api } from "../api/axios";
import type { Route } from "../types";

export async function check() {
  const res = await api.get("/api/routes/health");
  return res.data;
}

export async function getRoutes() {
  const res = await api.get("/api/routes");

  return res.data.routes;
}

export async function getRouteById(routeId: string) {
  const res = await api.get(`/api/route/${routeId}`);
  return res.data.route;
}

export async function getStopsByRouteId(routeId: string, directionId: number) {
  let endpoint = `/api/routes/${routeId}/stops`;
  if (directionId !== null) {
    endpoint += `?directionId=${directionId}`;
  }
  const res = await api.get(endpoint);
  return res.data;
}
// export async function getRoutesAndStops() {
//   const res = await api.get(`/api/routes/stops`);
//   return res.data;
// }
