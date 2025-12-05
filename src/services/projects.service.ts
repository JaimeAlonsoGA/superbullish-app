import { supabase } from "@/lib/supabase/client";
import { ProjectInsert, Project } from "@/types";

export async function getProjectsByUserId({ userId }: { userId: string }): Promise<Project[]> {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        throw error;
    }

    return data;
}

export async function upsertProject(project: ProjectInsert): Promise<Project> {
    const { data, error } = await supabase
        .from('projects')
        .upsert(project)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function uploadLogoFile(file: File): Promise<string | null> {
    const ext = file.name.split(".").pop() ?? "png";
    const name = `${crypto.randomUUID()}.${ext}`;
    const { data, error } = await supabase.storage
        .from("projects-logos")
        .upload(name, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const urlResult = supabase.storage
        .from("projects-logos")
        .getPublicUrl(data.path);

    return urlResult.data.publicUrl ?? null;
}
