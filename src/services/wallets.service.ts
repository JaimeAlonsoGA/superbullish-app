import { supabase } from "@/lib/supabase/client";
import { AdminWallet } from "@/types";

export async function getAdminWallet(chainId: number): Promise<AdminWallet | null> {
    const { data, error } = await supabase
        .from("admin_wallets")
        .select("*")
        .eq("chain_id", chainId)
        .single();

    if (error || !data) {
        console.error(`No admin wallet found for chain ${chainId}`, error);
        return null;
    }

    return data;
}