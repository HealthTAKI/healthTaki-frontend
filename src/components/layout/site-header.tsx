"use client";

import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button";
import { WalletMenu } from "@/components/wallet/wallet-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useWallet } from "@/context/wallet-context";
import { Stethoscope } from "lucide-react";

export function SiteHeader() {
  const { status } = useWallet();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Stethoscope className="text-primary" />
          <div>
            <p className="font-heading text-sm font-semibold leading-none">HealthTaki</p>
            <p className="text-xs text-muted-foreground">Stellar payments for medical personnel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === "connected" ? <WalletMenu /> : <ConnectWalletButton />}
        </div>
      </div>
    </header>
  );
}
