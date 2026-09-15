# HealthTaki — Stellar payments for medical personnel

A Next.js frontend that lets healthcare providers connect a Stellar wallet
(via [Freighter](https://freighter.app)), share an address to receive patient
payments, and track balances and incoming payments on-chain.

This is a **frontend-only** scaffold: there is no backend, and no custody of
funds — it reads and writes directly against the Stellar network (Horizon +
the user's own Freighter wallet).

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Install the
[Freighter](https://www.freighter.app/) browser extension, create/import a
testnet account, and click "Connect Freighter" to try the dashboard. Unfunded
testnet accounts can be funded from the dashboard via Friendbot.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [`@stellar/stellar-sdk`](https://github.com/stellar/js-stellar-sdk) for Horizon reads (balances, payments)
- [`@stellar/freighter-api`](https://github.com/stellar/freighter-api) for wallet connection

## Project structure

```
src/
  app/                     App Router pages and layout
  components/
    dashboard/             Balance, receive-address, and recent-payments widgets
    wallet/                Connect button and wallet menu
    layout/                Site header
    ui/                    shadcn/ui primitives
  context/wallet-context.tsx  Wallet connection state (React context)
  lib/stellar/
    config.ts              Network config (testnet/public via env var)
    horizon.ts              Horizon queries: balances, payments, friendbot funding
    freighter.ts             Freighter wallet wrapper
```

## Configuration

Set `NEXT_PUBLIC_STELLAR_NETWORK` in `.env.local` to `TESTNET` (default) or
`PUBLIC` to switch networks.

## Next steps

This scaffold covers connecting a wallet and viewing balances/incoming
payments. Natural extensions: sending/requesting payments, Soroban contract
interactions, multi-account support, and a real backend for
appointments/invoicing if this grows beyond a pure wallet dashboard.
