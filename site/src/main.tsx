import React from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createSiteRouter } from "./router";
import "./styles.css";
import { parseRouteContent, rememberContent } from "./lib/load-content";

const initial = rememberContent(parseRouteContent(JSON.parse(document.getElementById("page-content")!.textContent!), location.pathname));

hydrateRoot(document.getElementById("root")!,
  <React.StrictMode>
    <RouterProvider router={createSiteRouter(initial)} />
  </React.StrictMode>,
);
