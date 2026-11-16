import { useQuery } from "@tanstack/react-query";
import { getStops, getStopTimetables } from "@/services/stopsService";

export const useStops = () =>
  useQuery({ queryKey: ["stops"], queryFn: getStops });

export const useStopsTimetables = (
  stopId: string | null,
  directionId?: number,
) => {
  return useQuery({
    queryKey: ["stops-timetable", stopId, directionId],
    queryFn: () => getStopTimetables(stopId!, directionId),
    enabled: !!stopId,
  });
};
