import { api } from "../api/axios";

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
  if (directionId != null) {
    endpoint += `?directionId=${directionId}`;
  }
  const res = await api.get(endpoint);
  return res.data;
}
// export async function getRoutesAndStops() {
//   const res = await api.get(`/api/routes/stops`);
//   return res.data;
// }

export type TravelTime = {
  trips: number;
  minMinutes: number;
  minutes: number;
  maxMinutes: number;
};

export async function getTravelTime(
  routeId: string,
  from: string,
  to: string,
  directionId: number,
): Promise<TravelTime> {
  const res = await api.get(`/api/routes/${routeId}/travel-time`, {
    params: { from, to, directionId },
  });
  return res.data;
}
