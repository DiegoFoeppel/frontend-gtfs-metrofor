// import { Stop } from "@/src/types/types";
import { Marker, Tooltip } from "react-leaflet";
import { getStopTimetables } from "../services/stopsService";
export const RenderMarker = ({ stops }: { stops: Stop[] }) => {
  const handleStopClick = async (stop) => {
    console.log("data", stop);
    try {
      const data = await getStopTimetables(stop.stopId);

      console.log("data", data);
    } catch (err) {
      console.log("err", err);
    }
  };
  return stops.map((stop) => (
    <Marker
      key={stop.stopId}
      //   position={{
      //     latitude: stop.stopLat,
      //     longitude: stop.stopLon,
      //   }}
      eventHandlers={{
        click: () => handleStopClick(stop),
      }}
      position={[stop.stopLat, stop.stopLon]}
      //   image={require("../assets/images/tram-front.png")}
      //   onPress={() => console.log(stop)}
    >
      <Tooltip>{stop.stopName}</Tooltip>
    </Marker>
  ));
};
