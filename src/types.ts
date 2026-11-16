export type Stop = {
  stopId: string;
  stopCode: string;
  stopName: string;
  stopLat: number;
  stopLon: number;
};

export type Line = {
  routeId: string;
  routeShortName: string | null;
  routeLongName: string;
  routeColor: string;
  routeDesc: string;
  routeTextColor: string;
};

export type Route = {
  routeId: string;
  agencyId: string;
  cityId: string;
  routeShortName: string | null;
  routeLongName: string;
  routeDesc: string;
  routeType: number;
  routeUrl: string;
  routeColor: string;
  routeTextColor: string;
};

export type StopProps = {
  stop: Stop;
  onOpenChange: () => void;
};

export type Timetable = {
  directionId: number;
  sentido: string;
  horarios: string[];
};

export type City = "fortaleza" | "sobral" | "cariri";

export type Direction = {
  id: number;
  label: string;
};

export type SelectProps = {
  directions: Direction[];
  direction: number;
  onValueChange: (value: string) => void;
};

export type LineInfoProps = {
  line: CompleteRoute;
  onOpenChange: () => void;
};

export type CompleteRoute = {
  type: string;
  id: string;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  properties: {
    name: string;
    description: string;
    routeId: string;
    color: string;
    cityId: string;
  };
};
