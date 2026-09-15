export type StellarNetwork = "TESTNET" | "PUBLIC";

const network = (process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "TESTNET").toUpperCase() as StellarNetwork;

export const STELLAR_NETWORK: StellarNetwork = network === "PUBLIC" ? "PUBLIC" : "TESTNET";

export const NETWORK_PASSPHRASE =
  STELLAR_NETWORK === "PUBLIC"
    ? "Public Global Stellar Network ; September 2015"
    : "Test SDF Network ; September 2015";

export const HORIZON_URL =
  STELLAR_NETWORK === "PUBLIC" ? "https://horizon.stellar.org" : "https://horizon-testnet.stellar.org";

export const FRIENDBOT_URL = "https://friendbot.stellar.org";
