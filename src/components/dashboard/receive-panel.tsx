"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useWallet } from "@/context/wallet-context";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function ReceivePanel() {
  const { address } = useWallet();

  if (!address) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied — share it with your patient to receive payment");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receive a payment</CardTitle>
        <CardDescription>
          Share this Stellar address with a patient or billing system to receive funds directly.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <code className="flex-1 overflow-x-auto rounded-md bg-muted px-3 py-2 text-xs">
          {address}
        </code>
        <Button size="icon" variant="outline" onClick={copyAddress}>
          <Copy />
        </Button>
      </CardContent>
    </Card>
  );
}
