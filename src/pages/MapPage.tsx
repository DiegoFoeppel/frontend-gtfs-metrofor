import { useEffect, useState } from "react";
import Map from "../components/Map";
import { check, getRoutes, getRoutesAndStops } from "../services/routesService";
import { getStopById, getStopTimetables } from "../services/stopsService";
import axios from "axios";

const MapPage = () => {
  const [linha, onChangeLinha] = useState<string>("");
  const [coords, setCoords] = useState([]);
  const [visible, setVisible] = useState(false);
  const [shape, setShape] = useState([]);
  const [routeDirections, setRouteDirections] = useState([]);
  const [routes, setRoutes] = useState<Properties[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);

  useEffect(() => {
    const fetchRoutesAndStops = async () => {
      try {
        const data = await getRoutesAndStops();

        console.log("response", data);

        setStops(data.stopsLine);
        setRoutes(data.geojson.features);
      } catch (err) {
        console.log("err", err);
      }
    };

    fetchRoutesAndStops();
  }, []);

  return <Map />;
  // <Map stops={stops} routes={routes} />;
};

export default MapPage;
