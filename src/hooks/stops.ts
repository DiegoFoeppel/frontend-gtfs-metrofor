import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
    // Mantém os horários anteriores visíveis até os novos chegarem (zero flicker!)
    placeholderData: keepPreviousData,
    // Dados de GTFS estático não mudam a cada segundo: evita refetch desnecessário
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
