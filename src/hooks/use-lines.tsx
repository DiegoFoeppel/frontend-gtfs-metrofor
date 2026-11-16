// hooks/use-lines.ts
import { useMemo } from "react";
import { allLines } from "@/data/index";
import { useRoutes } from "./routes";
import type { Route } from "@/types";

export function useCompleteRoutes() {
  const { data: routes = [], isLoading } = useRoutes();

  console.log("uisdbnaiujdb", routes);

  const fullRoutes = useMemo(() => {
    if (!routes) return null;

    const byId = new Map(routes.map((r) => [r.routeId, r]));

    console.log("byid", byId);

    const features = allLines.features.flatMap((f) => {
      const route: Route = byId.get(f.properties.routeId);
      if (!route) return [];
      return [
        {
          ...f,
          properties: {
            ...f.properties,
            name: route.routeLongName,
            color: `#${route.routeColor}`,
            cityId: route.cityId,
            description: route.routeDesc,
          },
        },
      ];
    });

    return { ...allLines, features };
  }, [routes]);

  return { fullRoutes, isLoadingAll: isLoading };
}
