import React from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createSiteRouter } from "./router";
import "./styles.css";

hydrateRoot(document.getElementById("root")!,
  <React.StrictMode>
    <RouterProvider router={createSiteRouter()} />
  </React.StrictMode>,
);
