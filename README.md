# watchb20

B20 token deployer, tracker, mint/burn & transfer dApp on **Base**.

## Features

- **Deploy** — launch a new B20 token (simple & advanced modes) via `base-forge`
- **Tracker** — live token dashboard: supply, holders, stats
- **Mint / Burn** — manage token supply
- **Transfer & Payment** — send tokens, EIP-5792 batched calls
- **Base Notifications** — push updates via Base Notifications API

## Stack

- Next.js 14 (App Router) + TypeScript
- wagmi v2 + viem for wallet/contract interaction
- EIP-5792 wallet capabilities detection
- `base-forge` CLI for contract deployment (server-side)

## Project Structure

```
app/                  # Next.js App Router pages + API routes
  deploy/             # Deploy B20 form
  tracker/[address]/  # Token dashboard
  mint/[address]/     # Mint/burn UI
  transfer/           # Transfer & payment
  api/deploy/         # Backend: run base-forge
  api/notify/         # Base Notifications API
components/            # UI components grouped by feature
config/               # wagmi config + B20 ABI/factory address
hooks/                # Contract read/write hooks
lib/                  # base-forge runner + notifications wrapper
```

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

See `.env.example` for required variables (RPC URL, factory address, notification keys, etc.).
