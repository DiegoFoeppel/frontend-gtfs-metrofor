import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StopContent } from "./StationInfo";
import type { Stop } from "@/types";

const useStopsTimetables = vi.fn();
vi.mock("@/hooks/stops", () => ({
  useStopsTimetables: (...args: unknown[]) => useStopsTimetables(...args),
}));

const stop: Stop = {
  stopId: "14",
  stopCode: "PCI",
  stopName: "Padre Cícero",
  stopLat: -3.74,
  stopLon: -38.54,
};

const timetables = [
  { directionId: 0, sentido: "Carlito Benevides", horarios: ["11:50", "12:10", "12:30"] },
  { directionId: 1, sentido: "Chico da Silva", horarios: ["11:00"] },
];

const ready = (data: unknown) => ({
  data,
  isLoading: false,
  isError: false,
  error: null,
  refetch: vi.fn(),
});

// Segunda-feira, 12:00 em Fortaleza (UTC-3)
const MONDAY_NOON = new Date("2026-03-09T15:00:00Z");
const SUNDAY_NOON = new Date("2026-03-08T15:00:00Z");

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(MONDAY_NOON);
});

afterEach(() => {
  vi.useRealTimers();
  useStopsTimetables.mockReset();
});

describe("StopContent", () => {
  it("mostra o próximo trem de cada sentido", () => {
    useStopsTimetables.mockReturnValue(ready({ timetables }));
    render(<StopContent stop={stop} clearStop={() => {}} />);

    expect(screen.getByText("Sentido Carlito Benevides")).toBeInTheDocument();
    expect(screen.getByText("Sentido Chico da Silva")).toBeInTheDocument();
    // próximo do sentido 0: 12:10, em 10 min
    expect(screen.getAllByText("12:10").length).toBeGreaterThan(0);
    expect(screen.getByText(/em 10 min/)).toBeInTheDocument();
    // sentido 1 não tem mais partidas
    expect(screen.getByText("Sem mais partidas hoje")).toBeInTheDocument();
  });

  it("mostra a grade do dia aberta por padrão", () => {
    useStopsTimetables.mockReturnValue(ready({ timetables }));
    render(<StopContent stop={stop} clearStop={() => {}} />);

    expect(screen.getByText("11:50")).toBeVisible();
    expect(screen.getByText("12:30")).toBeVisible();
  });

  it("avisa que não há operação aos domingos", () => {
    vi.setSystemTime(SUNDAY_NOON);
    useStopsTimetables.mockReturnValue(ready({ timetables }));
    render(<StopContent stop={stop} clearStop={() => {}} />);

    expect(screen.getByText("Não há operação aos domingos.")).toBeInTheDocument();
    expect(screen.queryByText("Sentido Carlito Benevides")).not.toBeInTheDocument();
  });

  it("mostra mensagem quando a estação não tem horários", () => {
    useStopsTimetables.mockReturnValue(ready({ timetables: [] }));
    render(<StopContent stop={stop} clearStop={() => {}} />);

    expect(
      screen.getByText("Nenhum horário previsto para esta estação hoje."),
    ).toBeInTheDocument();
  });

  it("mostra erro e permite tentar novamente", async () => {
    vi.useRealTimers();
    const refetch = vi.fn();
    useStopsTimetables.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Network Error"),
      refetch,
    });
    render(<StopContent stop={stop} clearStop={() => {}} />);

    expect(screen.getByRole("alert")).toHaveTextContent("Network Error");
    await userEvent.click(screen.getByRole("button", { name: /tentar novamente/i }));
    expect(refetch).toHaveBeenCalledOnce();
  });

  it("volta para a lista ao clicar na seta", async () => {
    vi.useRealTimers();
    const clearStop = vi.fn();
    useStopsTimetables.mockReturnValue(ready({ timetables }));
    render(<StopContent stop={stop} clearStop={clearStop} />);

    await userEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(clearStop).toHaveBeenCalledOnce();
  });
});
