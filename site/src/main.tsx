import React from "react";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { contentErrorCopy, createSiteRouter } from "./router";
import "./styles.css";
import { parseRouteContent, rememberContent } from "./lib/load-content";

const root = document.getElementById("root");
if (root) void hydratePage(root);

async function hydratePage(root: HTMLElement) {
  try {
    const payload = document.getElementById("page-content")?.textContent;
    if (!payload) throw new Error("Missing page content");
    const initial = rememberContent(parseRouteContent(JSON.parse(payload), location.pathname));
    const router = await createSiteRouter(initial);
    hydrateRoot(root,
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>,
    );
  } catch {
    const lang = document.documentElement.lang;
    const [message, retry] = lang === "en" || lang === "sv" || lang === "th" ? contentErrorCopy[lang] : contentErrorCopy.fi;
    const notice = document.createElement("p");
    notice.className = "container";
    notice.setAttribute("role", "status");
    const link = document.createElement("a");
    link.href = location.href;
    link.textContent = retry;
    notice.append(message + ". ", link);
    root.before(notice);
    console.warn("Recipavo: page hydration could not start");
  }
}
