"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

interface SolanaProviderProps {
  children: React.ReactNode;
}

export function SolanaProvider({ children }: SolanaProviderProps) {
  // Network defaults to mainnet-beta (production behavior unchanged unless
  // explicitly overridden) — set NEXT_PUBLIC_SOLANA_NETWORK=devnet locally
  // to test with free devnet USDC against a local/devnet-configured backend.
  const network = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_SOLANA_NETWORK;
    return configured === "devnet"
      ? WalletAdapterNetwork.Devnet
      : WalletAdapterNetwork.Mainnet;
  }, []);
  // clusterApiUrl() resolves to the public api.mainnet-beta.solana.com
  // endpoint, which is shared by every Solana dApp on the internet with no
  // API key — it rate-limits/403s under load. A dedicated RPC provider
  // (Helius/QuickNode/etc.) is required for real usage; the public endpoint
  // is only a fallback so local dev doesn't hard-fail if unconfigured.
  const endpoint = useMemo(() => {
    const configured = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    if (!configured) {
      console.error(
        "NEXT_PUBLIC_SOLANA_RPC_URL is not set — falling back to the public Solana RPC endpoint, which will 403 under real usage. Set a dedicated RPC provider URL."
      );
      return clusterApiUrl(network);
    }
    return configured;
  }, [network]);

  // Configure supported wallets (Wallet Standard is automatically supported)
  // We avoid manually instantiating Phantom/Solflare to prevent Brave Wallet conflict
  // where Brave intercepts window.solana
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
