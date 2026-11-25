import { cities } from "@/data";
import { useSearchParams } from "react-router";

const CIDADES_VALIDAS = ["fortaleza", "cariri", "sobral"] as const;
type CidadeId = (typeof CIDADES_VALIDAS)[number];

export function useCidadeParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCidade = searchParams.get("cidade");

  // Se não houver parâmetro ou for inválido, faz fallback seguro para "fortaleza"
  const cidade: CidadeId = CIDADES_VALIDAS.includes(rawCidade as CidadeId)
    ? (rawCidade as CidadeId)
    : "fortaleza";

  const { center, zoom } = cities[cidade];

  const setCidade = (novaCidade: CidadeId) => {
    setSearchParams(
      (prev) => {
        prev.set("cidade", novaCidade);
        return prev;
      },
      { replace: true }, // Evita encher o histórico do botão "Voltar" a cada troca
    );
  };

  return { cidade, center, zoom, setCidade };
}
