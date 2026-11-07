import React from "react";
import { createRoot } from "react-dom/client";
import { AssistantMockPreview } from "../src/features/assistant/AssistantMockPreview";

const root = document.getElementById("assistant-preview-root");
if (!root) throw new Error("A2 preview root missing");
createRoot(root).render(<React.StrictMode><AssistantMockPreview /></React.StrictMode>);
