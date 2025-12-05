import { supabase } from "@/lib/supabase/client";
import { TokenPrice } from "@/types";

export async function fetchTokenUsdByCoingeckoId(id: string) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(
        id
    )}&vs_currencies=usd`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed fetching token price");

    const json = await res.json();

    console.log("fetchTokenUsdByCoingeckoId fetched data:", json);

    return typeof json[id]?.usd === "number" ? json[id].usd : null;
}


export async function getTokenData(): Promise<TokenPrice[]> {
    const { data, error } = await supabase
        .from('token_prices')
        .select('*');

    if (error) {
        console.error("Error fetching crypto data:", error);
        throw error;
    }

    return data ?? [];
}