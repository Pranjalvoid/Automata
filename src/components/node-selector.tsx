"use client";

import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { NodeType } from "@/generated/prisma";
import { Separator } from "./ui/separator";

/**
 * Represents one selectable node option in the sidebar.
 */
export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;

  /**
   * Icon can either be:
   * - A React component (Lucide icon)
   * - A string path to an image/logo
   */
  icon: React.ComponentType<{ className?: string }> | string;
};

/**
 * Trigger nodes are used to START the workflow.
 */
const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs the flow on clicking a button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow when a Google Form is submitted",
    icon: "/logos/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description: "Runs the flow when a Stripe Event is captured",
    icon: "/logos/stripe.svg",
  },
];

/**
 * Execution nodes perform actions INSIDE the workflow.
 */
const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: GlobeIcon,
  },
  {
    type: NodeType.GEMINI,
    label: "Gemini",
    description: "Uses Google Gemini to generate text",
    icon: "/logos/gemini.svg",
  },
  {
    type: NodeType.OPENAI,
    label: "OpenAI",
    description: "Uses OpenAI to generate text",
    icon: "/logos/openai.svg",
  },
  {
    type: NodeType.ANTHROPIC,
    label: "Anthropic",
    description: "Uses Anthropic to generate text",
    icon: "/logos/anthropic.svg",
  },
  {
    type: NodeType.DISCORD,
    label: "Discord",
    description: "Send a message to Discord",
    icon: "/logos/discord.svg",
  },
  {
    type: NodeType.SLACK,
    label: "Slack",
    description: "Send a message to Slack",
    icon: "/logos/slack.svg",
  },
];

/**
 * Props for NodeSelector component.
 */
interface NodeSelectorProps {
  /**
   * Controls whether the sheet is open or closed.
   */
  open: boolean;

  /**
   * Callback to update sheet open state.
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Trigger button/content passed from parent.
   */
  children: React.ReactNode;
}

/**
 * NodeSelector
 *
 * Sidebar sheet that allows users to select and add nodes
 * into the React Flow canvas.
 */
export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  /**
   * React Flow helpers
   */
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  /**
   * Handles adding a new node to the canvas.
   */
  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      /**
       * Prevent multiple MANUAL_TRIGGER nodes.
       */
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();

        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );

        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed per workflow");

          return;
        }
      }

      /**
       * Update nodes in React Flow state.
       */
      setNodes((nodes) => {
        /**
         * Check if INITIAL node already exists.
         */
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL,
        );

        /**
         * Find center of current viewport.
         */
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        /**
         * Convert screen coordinates to React Flow coordinates.
         *
         * Random offset prevents nodes from stacking exactly
         * on top of each other.
         */
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });

        /**
         * Create new node object.
         */
        const newNode = {
          id: createId(), // unique node id
          data: {}, // custom node data
          position: flowPosition,
          type: selection.type,
        };

        /**
         * If initial trigger exists,
         * replace all nodes with this new node.
         *
         * Otherwise append node to existing list.
         */
        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });

      /**
       * Close sheet after selection.
       */
      onOpenChange(false);
    },
    [setNodes, getNodes, onOpenChange, screenToFlowPosition],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Trigger button/content */}
      <SheetTrigger asChild>{children}</SheetTrigger>

      {/* Right sidebar */}
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        {/* Header */}
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>

          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>

        {/* Trigger Nodes Section */}
        <div>
          {triggerNodes.map((nodeType) => {
            const Icon = nodeType.icon;

            return (
              <div
                key={nodeType.type}
                className="
                  w-full
                  justify-start
                  h-auto
                  py-5
                  px-4
                  rounded-none
                  cursor-pointer
                  border-l-2
                  border-transparent
                  hover:border-l-primary
                "
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {/* Render image icon OR React component icon */}
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}

                  {/* Text content */}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <Separator />

        {/* Execution Nodes Section */}
        <div>
          {executionNodes.map((nodeType) => {
            const Icon = nodeType.icon;

            return (
              <div
                key={nodeType.type}
                className="
                  w-full
                  justify-start
                  h-auto
                  py-5
                  px-4
                  rounded-none
                  cursor-pointer
                  border-l-2
                  border-transparent
                  hover:border-l-primary
                "
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {/* Render image OR component icon */}
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}

                  {/* Node text */}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
