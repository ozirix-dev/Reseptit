import { useRouteLoaderData } from "react-router-dom";
import type { RouteContent } from "../content/route-data";

export function useContent(): RouteContent {
  return useRouteLoaderData("content") as RouteContent;
}
