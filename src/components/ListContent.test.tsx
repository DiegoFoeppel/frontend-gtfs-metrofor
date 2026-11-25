import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ListContent from "./ListContent";
import type { CompleteRoute, Stop } from "@/types";

const route = (
  routeId: string,
  name: string,
  cityId: string,
): CompleteRoute => ({
  type: "Feature",
  id: routeId,
  geometry: { type: "LineString", coordinates: [] },
  properties: {
    routeId,
    name,
    description: `${name} desc`,
    color: "#ff0000",
    cityId,
    type: 1,
  },
});

const routes = [
  route("1", "Linha Sul", "1"),
  route("2", "Linha Oeste", "1"),
  route("5", "Vlt Sobral", "2"),
];

const stops: Stop[] = [
  { stopId: "1", stopCode: "CHS", stopName: "Chico da Silva", stopLat: -3.73, stopLon: -38.54 },
  { stopId: "2", stopCode: "PAR", stopName: "Parangaba", stopLat: -3.78, stopLon: -38.56 },
];

function setup(overrides: Partial<React.ComponentProps<typeof ListContent>> = {}) {
  const onSelectRoute = vi.fn<(line: CompleteRoute) => void>();
  const onSelectStop = vi.fn<(stop: Stop) => void>();
  const onCityChange = vi.fn();
  render(
    <ListContent
      city='fortaleza'
      routes={routes}
      stops={stops}
      onSelectRoute={onSelectRoute}
      onSelectStop={onSelectStop}
      onCityChange={onCityChange}
      {...overrides}
    />,
  );
  return { onSelectRoute, onSelectStop, onCityChange };
}

afterEach(() => {
  Reflect.deleteProperty(navigator, "geolocation");
});

describe("ListContent", () => {
  it("lista só as linhas da cidade selecionada", () => {
    setup();
    expect(screen.getByText("Linha Sul")).toBeInTheDocument();
    expect(screen.getByText("Linha Oeste")).toBeInTheDocument();
    expect(screen.queryByText("Vlt Sobral")).not.toBeInTheDocument();
  });

  it("mostra Metrô ou VLT conforme o tipo da linha", () => {
    setup({ routes: [route("1", "Linha Sul", "1"), { ...route("7", "Vlt X", "1"), properties: { ...route("7", "Vlt X", "1").properties, type: 0 } }] });
    expect(screen.getByText(/Metrô - Linha Sul desc/)).toBeInTheDocument();
    expect(screen.getByText(/VLT - Vlt X desc/)).toBeInTheDocument();
  });

  it("filtra linhas pela busca, ignorando acentos e maiúsculas", async () => {
    setup();
    await userEvent.type(screen.getByPlaceholderText(/buscar/i), "OESTE");
    expect(screen.getByText("Linha Oeste")).toBeInTheDocument();
    expect(screen.queryByText("Linha Sul")).not.toBeInTheDocument();
  });

  it("busca estações por nome sem acento e por código", async () => {
    setup();
    const input = screen.getByPlaceholderText(/buscar/i);

    await userEvent.type(input, "parangaba");
    expect(screen.getByText("Parangaba")).toBeInTheDocument();

    await userEvent.clear(input);
    await userEvent.type(input, "chs");
    expect(screen.getByText("Chico da Silva")).toBeInTheDocument();
  });

  it("não lista estações sem busca", () => {
    setup();
    expect(screen.queryByText("Parangaba")).not.toBeInTheDocument();
  });

  it("mostra mensagem quando nada é encontrado", async () => {
    setup();
    await userEvent.type(screen.getByPlaceholderText(/buscar/i), "zzzz");
    expect(screen.getByText("Nada encontrado.")).toBeInTheDocument();
  });

  it("seleciona uma linha ao clicar", async () => {
    const props = setup();
    await userEvent.click(screen.getByText("Linha Sul"));
    expect(props.onSelectRoute).toHaveBeenCalledWith(routes[0]);
  });

  it("seleciona a estação mais próxima pelo botão de localização", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (ok: PositionCallback) =>
          ok({ coords: { latitude: -3.731, longitude: -38.541 } } as GeolocationPosition),
      },
    });
    const props = setup();

    await userEvent.click(screen.getByRole("button", { name: /estação perto de mim/i }));

    expect(props.onSelectStop).toHaveBeenCalledOnce();
    expect(props.onSelectStop.mock.calls[0][0].stopId).toBe("1");
  });

  it("mostra erro quando a localização é negada", async () => {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: {
        getCurrentPosition: (_: PositionCallback, err: PositionErrorCallback) =>
          err({ code: 1, PERMISSION_DENIED: 1 } as GeolocationPositionError),
      },
    });
    const props = setup();

    await userEvent.click(screen.getByRole("button", { name: /estação perto de mim/i }));

    expect(screen.getByRole("alert")).toHaveTextContent("Permissão de localização negada.");
    expect(props.onSelectStop).not.toHaveBeenCalled();
  });
});
