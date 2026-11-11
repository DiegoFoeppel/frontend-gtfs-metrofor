import { useQuery } from "@tanstack/react-query";
import { getRoutes, getRoutesAndStops } from "../services/routesService";
import { getStopTimetables } from "@/services/stopsService";

export const useStops = () =>
  useQuery({ queryKey: ["stations"], queryFn: getRoutesAndStops });

export const useStopsTimetables = (stopId: string) => {
  return useQuery({
    queryKey: ["stations", stopId],
    queryFn: () => getStopTimetables(stopId),
  });
};
