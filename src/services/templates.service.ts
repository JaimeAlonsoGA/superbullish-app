import { supabase } from "@/lib/supabase/client";
import { Template } from "@/types";

export async function getVideoTemplates(): Promise<Template[]> {
    const { data, error } = await supabase
        .from('templates')
        .select('*');

    if (error) return [];

    return data as Template[];
}
