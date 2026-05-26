import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { UpgradeModal } from "@/components/upgrade-modal";

export const useUpgradeModal = () => {
  // Controls whether the upgrade modal is open or closed
  const [open, setOpen] = useState(false);

  // Handles API errors and opens upgrade modal
  // when the user hits a restricted/paid feature
  const handleError = (error: unknown) => {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === "FORBIDDEN") {
        setOpen(true);
        return true;
      }
    }

    return false;
  };

  // Upgrade modal component instance
  const modal = <UpgradeModal open={open} onOpenChange={setOpen} />;

  return { handleError, modal };
};
