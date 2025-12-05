import { useQuery } from "@tanstack/react-query";
import { getAdminWallet } from "@/services/wallets.service";

export function useAdminWallet(chainId: number | undefined) {
    return useQuery({
        queryKey: ["admin-wallet", chainId],
        queryFn: () => (chainId ? getAdminWallet(chainId) : null),
        enabled: Boolean(chainId),
        staleTime: 5 * 60_000, // 5 min cache
        retry: 1,
    });
}