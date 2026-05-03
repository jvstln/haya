export {};

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      disconnect?: () => Promise<void>;
    };
  }
}
