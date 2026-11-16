import { cn } from "cn";

const RoutesList = ({ routes }) => {
  console.log("routes", routes);
  return (
    <ol>
      {routes.map((r) => (
        <li
          key={r.properties.routeId}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors",
            // isActive ? "bg-muted" : "hover:bg-muted/50",
          )}
        >
          <span
            className='h-4 w-0.5 shrink-0 rounded-full'
            style={{
              backgroundColor: r.properties.color,
              // opacity: isActive ? 1 : inactiveOpacity,
              // opacity: noneSelected ? 1 : isActive ? 1 : 0.35,
              opacity: 1,
              // opacity: lineIndex ? 0.35 : 1,
            }}
          />
          <span
          // className={cn(
          //   "text-sm font-medium tabular-nums",
          //   !isActive && "text-muted-foreground",
          // )}
          >
            {r.properties.name}
          </span>
        </li>
      ))}
    </ol>
  );
};

export default RoutesList;
