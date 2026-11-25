import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useNearestStop } from "./useNearestStop";
import type { Stop } from "@/types";

const stops: Stop[] = [
  { stopId: "1", stopCode: "A", stopName: "Perto", stopLat: -3.73, stopLon: -38.54 },
  { stopId: "2", stopCode: "B", stopName: "Longe", stopLat: -3.9, stopLon: -38.7 },
];

function mockGeolocation(impl: (ok: PositionCallback, err: PositionErrorCallback) => void) {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition: impl },
  });
}

const position = (latitude: number, longitude: number) =>
  ({ coords: { latitude, longitude } }) as GeolocationPosition;

afterEach(() => {
  Reflect.deleteProperty(navigator, "geolocation");
});

describe("useNearestStop", () => {
  it("entrega a estação mais próxima", () => {
    mockGeolocation((ok) => ok(position(-3.731, -38.541)));
    const onFound = vi.fn();
    const { result } = renderHook(() => useNearestStop(stops));

    act(() => result.current.locate(onFound));

    expect(onFound).toHaveBeenCalledOnce();
    expect(onFound.mock.calls[0][0].stop.stopId).toBe("1");
    expect(result.current.error).toBeNull();
    expect(result.current.isLocating).toBe(false);
  });

  it("avisa quando o usuário está longe de qualquer estação", () => {
    // São Paulo
    mockGeolocation((ok) => ok(position(-23.55, -46.63)));
    const onFound = vi.fn();
    const { result } = renderHook(() => useNearestStop(stops));

    act(() => result.current.locate(onFound));

    expect(onFound).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Nenhuma estação perto de você.");
  });

  it("trata permissão negada", () => {
    mockGeolocation((_ok, err) =>
      err({ code: 1, PERMISSION_DENIED: 1 } as GeolocationPositionError),
    );
    const { result } = renderHook(() => useNearestStop(stops));

    act(() => result.current.locate(vi.fn()));

    expect(result.current.error).toBe("Permissão de localização negada.");
    expect(result.current.isLocating).toBe(false);
  });

  it("trata navegador sem geolocalização", () => {
    const { result } = renderHook(() => useNearestStop(stops));

    act(() => result.current.locate(vi.fn()));

    expect(result.current.error).toBe("Seu navegador não suporta localização.");
  });

  it("indica carregamento enquanto espera a posição", () => {
    mockGeolocation(() => {}); // nunca responde
    const { result } = renderHook(() => useNearestStop(stops));

    act(() => result.current.locate(vi.fn()));

    expect(result.current.isLocating).toBe(true);
  });
});
