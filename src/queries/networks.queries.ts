import { fetchTokenUsdByCoingeckoId } from "@/services/networks.service";
import { useQuery } from "@tanstack/react-query";

export function useTokenPrice(cgId?: string | null) {
    return useQuery<number | null, Error>({
        queryKey: ["tokenUsdPrice", cgId ?? "none"],
        queryFn: async () => {
            if (!cgId) return null;
            return await fetchTokenUsdByCoingeckoId(cgId);
        },
        enabled: Boolean(cgId),
        staleTime: 60_000,
        retry: 1,
    });
}
