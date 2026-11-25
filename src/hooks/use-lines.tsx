// hooks/use-lines.ts
import { useMemo } from "react";
import { allLines } from "@/data/index";
import { useRoutes } from "./routes";
import type { Route } from "@/types";

export function useCompleteRoutes() {
  const { data: routes = [], isLoading, error } = useRoutes();

  const fullRoutes = useMemo(() => {
    if (!routes) return null;

    const byId = new Map<string, Route>(
      (routes as Route[]).map((r) => [r.routeId, r]),
    );

    const features = allLines.features.flatMap((f) => {
      const route = byId.get(f.properties.routeId);
      if (!route) return [];
      return [
        {
          ...f,
          properties: {
            ...f.properties,
            name: route.routeLongName,
            color: `#${route.routeColor}`,
            cityId: route.cityId,
            type: route.routeType,
            description: route.routeDesc,
          },
        },
      ];
    });

    return { ...allLines, features };
  }, [routes]);

  return {
    fullRoutes,
    isLoadingCompleteRoutes: isLoading,
    errorRoutes: error,
  };
}
