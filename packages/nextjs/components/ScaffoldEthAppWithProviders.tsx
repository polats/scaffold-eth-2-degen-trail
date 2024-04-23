"use client";

import { ReactNode, useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { GetSiweMessageOptions, RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

type RainbowKitSiweNextAuthProviderProps = {
  children: ReactNode;
  session?: Session;
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

const getSiweMessageOptions: GetSiweMessageOptions = () => ({
  statement: "Sign in to the RainbowKit + SIWE example app",
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function ScaffoldEthAppWithProviders({ children, session }: RainbowKitSiweNextAuthProviderProps) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider refetchInterval={0} session={session}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ProgressBar />
          <RainbowKitSiweNextAuthProvider getSiweMessageOptions={getSiweMessageOptions}>
            <RainbowKitProvider
              avatar={BlockieAvatar}
              theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
            >
              <ScaffoldEthApp>{children}</ScaffoldEthApp>
            </RainbowKitProvider>
          </RainbowKitSiweNextAuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}
