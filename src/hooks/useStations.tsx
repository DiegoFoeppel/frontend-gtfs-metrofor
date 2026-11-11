import { useQuery } from "@tanstack/react-query";
import { getRoutes, getRoutesAndStops } from "../services/routesService";

const useStations = () =>
  useQuery({ queryKey: ["stations"], queryFn: getRoutesAndStops });

export default useStations;
