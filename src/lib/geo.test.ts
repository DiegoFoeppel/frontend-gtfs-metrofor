import { describe, expect, it } from "vitest";
import { distanceMeters, nearestStop } from "./geo";
import type { Stop } from "@/types";

const stop = (id: string, lat: number, lon: number): Stop => ({
  stopId: id,
  stopCode: id,
  stopName: `Estação ${id}`,
  stopLat: lat,
  stopLon: lon,
});

describe("distanceMeters", () => {
  it("é zero para o mesmo ponto", () => {
    expect(distanceMeters(-3.73, -38.54, -3.73, -38.54)).toBe(0);
  });

  it("1 grau de latitude vale ~111 km", () => {
    expect(distanceMeters(0, 0, 1, 0)).toBeGreaterThan(110_000);
    expect(distanceMeters(0, 0, 1, 0)).toBeLessThan(112_000);
  });

  it("é simétrica", () => {
    const a = distanceMeters(-3.73, -38.54, -3.8, -38.6);
    const b = distanceMeters(-3.8, -38.6, -3.73, -38.54);
    expect(a).toBeCloseTo(b, 6);
  });
});

describe("nearestStop", () => {
  const stops = [
    stop("far", -3.9, -38.7),
    stop("near", -3.731, -38.541),
    stop("mid", -3.76, -38.57),
  ];

  it("escolhe a estação mais próxima", () => {
    const result = nearestStop(stops, -3.73, -38.54);
    expect(result?.stop.stopId).toBe("near");
    expect(result!.distance).toBeLessThan(200);
  });

  it("retorna null sem estações", () => {
    expect(nearestStop([], -3.73, -38.54)).toBeNull();
  });
});
