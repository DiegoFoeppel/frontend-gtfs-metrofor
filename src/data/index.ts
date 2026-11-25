import fortaleza from "./fortaleza.json";
import sobral from "./sobral.json";
import cariri from "./cariri.json";

export type Props = {
  lineCoords: [number, number][] | null; // [lng, lat], da linha selecionada
  cityView: { center: [number, number]; zoom: number };
};

export const inactiveOpacity = 0.35;

export const cityView = {
  center: [-38.565, -3.8] as [number, number],
  zoom: 11.5,
};



export const allLines = {
  type: "FeatureCollection",
  features: [...fortaleza.features, ...sobral.features, ...cariri.features],
};

// type CityOption = {
//   city: {
//     center: [number, number],
//     zoom: number,
//     geojson:
//   }
// }

export const cities = {
  fortaleza: {
    center: [-38.54, -3.73],
    zoom: 11.5,
    geojson: fortaleza,
  },
  sobral: {
    center: [-40.35, -3.69],
    zoom: 13.5,
    geojson: sobral,
  },
  cariri: {
    center: [-39.359892, -7.227816],
    zoom: 13,
    geojson: cariri,
  },
};

type City = {
  id: number;
  label: string;
  value: "fortaleza" | "sobral" | "cariri";
};

export const selectCities: City[] = [
  {
    id: 1,
    label: "Fortaleza",
    value: "fortaleza",
  },
  {
    id: 2,
    label: "Sobral",
    value: "sobral",
  },
  {
    id: 3,
    label: "Cariri",
    value: "cariri",
  },
];
