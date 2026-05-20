import { SidebarTrigger } from "@/components/ui/sidebar";

// Simple header component with sidebar toggle button
export const AppHeader = () => {
  return (
    // Header container with fixed height, border, and background styling
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      
      {/* Button used to open/close the sidebar */}
      <SidebarTrigger />

    </header>
  );
};