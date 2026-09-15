import {
  getAddress,
  getNetworkDetails,
  isConnected,
  requestAccess,
} from "@stellar/freighter-api";

export interface FreighterAccount {
  address: string;
  network: string;
  networkPassphrase: string;
}

export class FreighterNotInstalledError extends Error {
  constructor() {
    super("Freighter wallet extension is not installed.");
    this.name = "FreighterNotInstalledError";
  }
}

export async function isFreighterInstalled(): Promise<boolean> {
  const { isConnected: connected } = await isConnected();
  return connected;
}

export async function connectFreighter(): Promise<FreighterAccount> {
  const installed = await isFreighterInstalled();
  if (!installed) {
    throw new FreighterNotInstalledError();
  }

  const access = await requestAccess();
  if (access.error) {
    throw new Error(access.error.message);
  }

  const network = await getNetworkDetails();
  if (network.error) {
    throw new Error(network.error.message);
  }

  return {
    address: access.address,
    network: network.network,
    networkPassphrase: network.networkPassphrase,
  };
}

export async function getConnectedAddress(): Promise<FreighterAccount | null> {
  const installed = await isFreighterInstalled();
  if (!installed) {
    return null;
  }

  const address = await getAddress();
  if (address.error || !address.address) {
    return null;
  }

  const network = await getNetworkDetails();
  if (network.error) {
    return null;
  }

  return {
    address: address.address,
    network: network.network,
    networkPassphrase: network.networkPassphrase,
  };
}
