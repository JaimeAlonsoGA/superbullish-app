import { useTokenPrice } from "@/queries/networks.queries";
import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";

type PriceResult = {
    priceNative: number | null;
    tokenUsd: number | null;
    symbol: string | null;
    formattedPrice: string | null;

    userBalance: number | null;
    formattedBalance: string | null;

    canAfford: boolean | null;
    delta: number | null;
    formattedDelta: string | null;

    isLoading: boolean;
    isError: boolean;
    error?: unknown;
};

const CHAIN_ID_TO_COINGECKO_ID: Record<number, string> = {
    1: "ethereum",
    137: "matic-network",
    43114: "avalanche-2",
    42161: "arbitrum",
    43113: "avalanche-2", // Fuji
    11155111: "ethereum", // Sepolia
};

export function useTemplatePrice(
    baseUsd?: number | null,
    opts?: { formatDigits?: number }
): PriceResult {
    const { address, chain } = useAccount();
    const chainId = chain?.id ?? null;
    const symbol = chain?.name ?? null;

    const cgId = chainId ? CHAIN_ID_TO_COINGECKO_ID[chainId] : null;

    // Fetch token price in USD
    const query = useTokenPrice(cgId);
    const tokenUsd = query.data ?? null;

    // Fetch user's wallet balance
    const { data: balanceData } = useBalance({
        address,
    });

    const userBalance = useMemo(() => {
        if (!balanceData) return null;
        return Number(balanceData.value) / 10 ** balanceData.decimals;
    }, [balanceData]);

    // Convert template USD price → token amount
    const priceNative = useMemo(() => {
        if (baseUsd == null || tokenUsd == null || tokenUsd <= 0) return null;
        return baseUsd / tokenUsd;
    }, [baseUsd, tokenUsd]);

    // Price formatted
    const formattedPrice = useMemo(() => {
        if (priceNative == null || !symbol) return null;
        const digits = opts?.formatDigits ?? 4;
        const small = priceNative < 0.0001;

        return small
            ? `${priceNative.toPrecision(3)} ${symbol}`
            : `${priceNative.toFixed(digits)} ${symbol}`;
    }, [priceNative, symbol, opts?.formatDigits]);

    // Balance formatted
    const formattedBalance = useMemo(() => {
        if (userBalance == null || !symbol) return null;
        return `${userBalance.toFixed(4)} ${symbol}`;
    }, [userBalance, symbol]);

    // Can user afford?
    const canAfford = useMemo(() => {
        if (userBalance == null || priceNative == null) return null;
        return userBalance >= priceNative;
    }, [userBalance, priceNative]);

    // Difference (how much the user is missing)
    const delta = useMemo(() => {
        if (userBalance == null || priceNative == null) return null;
        return priceNative - userBalance;
    }, [userBalance, priceNative]);

    const formattedDelta = useMemo(() => {
        if (delta == null || !symbol) return null;
        if (delta <= 0) return `0 ${symbol}`;
        return `${delta.toFixed(4)} ${symbol}`;
    }, [delta, symbol]);

    return {
        priceNative,
        tokenUsd,
        symbol,
        formattedPrice,

        userBalance,
        formattedBalance,

        canAfford,
        delta,
        formattedDelta,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
    };
}
