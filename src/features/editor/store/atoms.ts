import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";

// Global atom to store the current React Flow instance
// Allows components across the editor to access and interact
// with the flow canvas (nodes, edges, viewport, etc.)
export const editorAtom = atom<ReactFlowInstance | null>(null);
