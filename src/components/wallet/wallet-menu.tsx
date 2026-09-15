"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/context/wallet-context";
import { ChevronDown, Copy, LogOut } from "lucide-react";
import { toast } from "sonner";

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

export function WalletMenu() {
  const { address, network, disconnect } = useWallet();

  if (!address) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary">{network}</Badge>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          {truncateAddress(address)}
          <ChevronDown />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={copyAddress}>
            <Copy />
            Copy address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={disconnect} variant="destructive">
            <LogOut />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
