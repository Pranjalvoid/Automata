import { SidebarTrigger } from "@/components/ui/sidebar";

// Application header displayed at the top of the dashboard
export const AppHeader = () => {
  return (
    // Fixed-height header with horizontal layout and bottom border
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
      
      {/* Sidebar toggle button for opening and collapsing navigation */}
      <SidebarTrigger />

      {/* Additional header actions can be added here in the future */}

    </header>
  );
};
