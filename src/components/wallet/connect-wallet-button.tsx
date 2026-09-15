"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/wallet-context";
import { Loader2, Wallet } from "lucide-react";

export function ConnectWalletButton() {
  const { status, connect } = useWallet();
  const connecting = status === "connecting";

  return (
    <Button onClick={connect} disabled={connecting}>
      {connecting ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Wallet />
      )}
      {connecting ? "Connecting…" : "Connect Freighter"}
    </Button>
  );
}
