import { describe, expect, it } from "vitest";
import {
  formatEta,
  hasServiceToday,
  nextTrain,
  nowMinutes,
  toMinutes,
} from "./time";

// Fortaleza é UTC-3 o ano todo (sem horário de verão).
const at = (iso: string) => new Date(iso);

describe("toMinutes", () => {
  it("converte HH:MM e HH:MM:SS", () => {
    expect(toMinutes("00:00")).toBe(0);
    expect(toMinutes("05:30")).toBe(330);
    expect(toMinutes("13:32:45")).toBe(812);
  });

  it("aceita horários de 24h+ (padrão GTFS)", () => {
    expect(toMinutes("24:10")).toBe(1450);
  });
});

describe("nowMinutes", () => {
  it("usa o fuso de Fortaleza, não o do aparelho", () => {
    // 15:00 UTC = 12:00 em Fortaleza
    expect(nowMinutes(at("2026-03-10T15:00:00Z"))).toBe(12 * 60);
  });

  it("vira o dia corretamente", () => {
    // 02:30 UTC = 23:30 do dia anterior em Fortaleza
    expect(nowMinutes(at("2026-03-10T02:30:00Z"))).toBe(23 * 60 + 30);
  });
});

describe("nextTrain", () => {
  const horarios = ["05:00", "05:30", "06:00", "12:00"];

  it("retorna o primeiro horário a partir de agora", () => {
    expect(nextTrain(horarios, toMinutes("05:10"))).toEqual({
      time: "05:30",
      inMinutes: 20,
    });
  });

  it("inclui o trem que sai neste exato minuto", () => {
    expect(nextTrain(horarios, toMinutes("06:00"))).toEqual({
      time: "06:00",
      inMinutes: 0,
    });
  });

  it("retorna null quando não há mais partidas", () => {
    expect(nextTrain(horarios, toMinutes("12:01"))).toBeNull();
  });

  it("não depende da lista estar ordenada", () => {
    expect(nextTrain(["12:00", "05:00", "06:00"], toMinutes("05:10"))).toEqual({
      time: "06:00",
      inMinutes: 50,
    });
  });

  it("lida com lista vazia", () => {
    expect(nextTrain([], 100)).toBeNull();
  });
});

describe("formatEta", () => {
  it.each([
    [0, "agora"],
    [7, "em 7 min"],
    [59, "em 59 min"],
    [60, "em 1h"],
    [80, "em 1h20"],
    [125, "em 2h05"],
  ])("%i min -> %s", (minutes, expected) => {
    expect(formatEta(minutes)).toBe(expected);
  });
});

describe("hasServiceToday", () => {
  it("não há operação aos domingos", () => {
    // 2026-03-08 é domingo
    expect(hasServiceToday(at("2026-03-08T15:00:00Z"))).toBe(false);
  });

  it("há operação de segunda a sábado", () => {
    expect(hasServiceToday(at("2026-03-09T15:00:00Z"))).toBe(true); // seg
    expect(hasServiceToday(at("2026-03-14T15:00:00Z"))).toBe(true); // sáb
  });

  it("considera o dia em Fortaleza, não em UTC", () => {
    // 01:00 UTC de segunda = 22:00 de domingo em Fortaleza
    expect(hasServiceToday(at("2026-03-09T01:00:00Z"))).toBe(false);
  });
});
