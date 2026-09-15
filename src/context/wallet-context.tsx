"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  connectFreighter,
  FreighterNotInstalledError,
  getConnectedAddress,
} from "@/lib/stellar/freighter";

export type WalletStatus = "idle" | "connecting" | "connected" | "error";

interface WalletContextValue {
  address: string | null;
  network: string | null;
  status: WalletStatus;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);
  const [status, setStatus] = useState<WalletStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getConnectedAddress().then((account) => {
      if (account) {
        setAddress(account.address);
        setNetwork(account.network);
        setStatus("connected");
      }
    });
  }, []);

  const connect = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    try {
      const account = await connectFreighter();
      setAddress(account.address);
      setNetwork(account.network);
      setStatus("connected");
    } catch (err) {
      const message =
        err instanceof FreighterNotInstalledError
          ? "Freighter wallet is not installed. Install it from freighter.app to continue."
          : err instanceof Error
            ? err.message
            : "Failed to connect wallet.";
      setError(message);
      setStatus("error");
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setNetwork(null);
    setStatus("idle");
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ address, network, status, error, connect, disconnect }),
    [address, network, status, error, connect, disconnect],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
