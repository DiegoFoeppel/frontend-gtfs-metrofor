import { useQuery } from "@tanstack/react-query";
import { getRoutes, getStopsByRouteId } from "../services/routesService";

export const useRoutes = () =>
  useQuery({ queryKey: ["routes"], queryFn: getRoutes });

export const useStopsByRouteId = (routeId: string, direction: number) => {
  return useQuery({
    // queryKey: ["route-stops", routeId, direction],
    queryKey: ["route-stops", routeId, direction],
    queryFn: () => getStopsByRouteId(routeId, direction),
  });
};
