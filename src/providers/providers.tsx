import { getQueryClient } from '@/lib/react-query/get-query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/rainbow/config';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { AuthProvider } from './auth-provider';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './cart-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <BrowserRouter>
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider>
                        <AuthProvider>
                            <CartProvider>
                                {children}
                            </CartProvider>
                        </AuthProvider>
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </BrowserRouter>
    );
}