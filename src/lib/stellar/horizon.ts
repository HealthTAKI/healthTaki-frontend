import { Horizon } from "@stellar/stellar-sdk";
import { HORIZON_URL } from "./config";

export const horizonServer = new Horizon.Server(HORIZON_URL);

export interface AccountBalance {
  assetCode: string;
  assetIssuer?: string;
  balance: string;
}

export interface IncomingPayment {
  id: string;
  from: string;
  assetCode: string;
  amount: string;
  createdAt: string;
  transactionHash: string;
}

export async function fetchAccountBalances(publicKey: string): Promise<AccountBalance[]> {
  const account = await horizonServer.loadAccount(publicKey);
  return account.balances.map((balance) => {
    if (balance.asset_type === "native") {
      return { assetCode: "XLM", balance: balance.balance };
    }
    if ("asset_code" in balance) {
      return {
        assetCode: balance.asset_code,
        assetIssuer: balance.asset_issuer,
        balance: balance.balance,
      };
    }
    return { assetCode: "LIQUIDITY_POOL_SHARES", balance: balance.balance };
  });
}

function isPaymentRecord(
  record: Horizon.ServerApi.OperationRecord,
): record is Horizon.ServerApi.PaymentOperationRecord {
  return record.type === "payment";
}

export async function fetchRecentPayments(publicKey: string, limit = 10): Promise<IncomingPayment[]> {
  const page = await horizonServer
    .payments()
    .forAccount(publicKey)
    .order("desc")
    .limit(limit)
    .call();

  return page.records
    .filter(isPaymentRecord)
    .filter((record) => record.to === publicKey)
    .map((record) => ({
      id: record.id,
      from: record.from,
      assetCode: record.asset_type === "native" ? "XLM" : (record.asset_code ?? "UNKNOWN"),
      amount: record.amount,
      createdAt: record.created_at,
      transactionHash: record.transaction_hash,
    }));
}

export async function fundTestnetAccount(publicKey: string): Promise<void> {
  const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
  if (!response.ok) {
    throw new Error("Friendbot funding failed");
  }
}
