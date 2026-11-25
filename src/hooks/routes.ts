import { useQuery } from "@tanstack/react-query";
import { getRoutes, getStopsByRouteId, getTravelTime } from "../services/routesService";

export const useRoutes = () =>
  useQuery({ queryKey: ["routes"], queryFn: getRoutes });

export const useStopsByRouteId = (routeId: string, direction: number) => {
  return useQuery({
    // queryKey: ["route-stops", routeId, direction],
    queryKey: ["route-stops", routeId, direction],
    queryFn: () => getStopsByRouteId(routeId, direction),
  });
};

export const useTravelTime = (
  routeId: string,
  from: string | null,
  to: string | null,
  direction: number,
) =>
  useQuery({
    queryKey: ["travel-time", routeId, from, to, direction],
    queryFn: () => getTravelTime(routeId, from!, to!, direction),
    enabled: !!from && !!to,
    staleTime: Infinity, // feed estático: o tempo previsto não muda durante a sessão
    retry: false,
  });
