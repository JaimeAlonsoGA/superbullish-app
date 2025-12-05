import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { normalizeHex } from "@/lib/utils";
import { useUploadProjectLogo, useUpsertProject } from "@/queries/projects.queries";
import { ProjectSchema, ProjectFormValues } from "@/types/schemas/project.schema";
import type { Project } from "@/types";
import { useCurrentUser } from "@/queries/auth.queries";

interface Props {
    project?: Project | null;
    onSuccess?: (data: any) => void;
    onError?: (err: any) => void;
}

const ProjectForm: React.FC<Props> = ({ project, onSuccess, onError }) => {
    const { data: user } = useCurrentUser();
    const { mutateAsync: upsertProject } = useUpsertProject();
    const { mutateAsync: uploadLogoFile } = useUploadProjectLogo();

    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(project?.logo_url ?? null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            id: project?.id,
            name: project?.name ?? "",
            ticker: project?.ticker ?? "",
            main_color: project?.main_color ?? "#1D4ED8",
            background_color: project?.background_color ?? null,
            logo_url: project?.logo_url ?? null,
            user_id: project?.user_id ?? undefined,
        },
    });

    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => {
            URL.revokeObjectURL(url);
            setPreview(project?.logo_url ?? null);
        };
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) return;
        // Optional: validate file size/type here (e.g. < 2MB)
        setFile(f);
    };

    const handleSubmit = form.handleSubmit(async (values) => {
        setSubmitting(true);
        try {
            values.main_color = normalizeHex(values.main_color);
            values.background_color = values.background_color ? normalizeHex(values.background_color) : null;

            if (file) {
                setUploading(true);
                const publicUrl = await uploadLogoFile(file);
                values.logo_url = publicUrl;
                setUploading(false);
            }

            if (!values.user_id && !project?.user_id) {
                const owner = user?.id;
                if (owner) {
                    values.user_id = owner;
                }
            }

            const payload = {
                ...project,
                ...values,
            };

            const result = await upsertProject(payload as any);
            onSuccess?.(result);
        } catch (err) {
            console.error("Project submit failed", err);
            onError?.(err);
        } finally {
            setSubmitting(false);
            navigate("/dashboard");

        }
    });

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto">
            <Card className="rounded-2xl shadow p-4">
                <CardContent>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">{project ? "Edit Project" : "Create Your Project"}</h2>
                    </div>

                    <Form {...form}>
                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Acme Studios" aria-invalid={!!form.formState.errors.name} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ticker"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ticker</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                maxLength={6}
                                                placeholder="e.g. ABCX"
                                                aria-invalid={!!form.formState.errors.ticker}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="main_color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Primary color</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="color" className="w-20 h-10 p-1" value={field.value ?? "#1D4ED8"} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="background_color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Background color</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="color"
                                                    className="w-20 h-10 p-1"
                                                    value={field.value ?? "#F3F4F6"}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
                                <FormLabel>Logo</FormLabel>
                                <div className="flex items-center gap-4 mt-2">
                                    <label
                                        htmlFor="logo-upload"
                                        className="flex items-center gap-2 px-4 py-2 border rounded-xl cursor-pointer hover:bg-accent"
                                    >
                                        <Upload className="w-5 h-5" /> Upload
                                    </label>
                                    <input
                                        id="logo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        aria-label="Upload project logo"
                                    />

                                    {preview ? (
                                        <img src={preview} alt="logo preview" className="w-16 h-16 object-cover rounded-lg border" />
                                    ) : (
                                        <div className="w-16 h-16 rounded-lg border bg-muted/10 flex items-center justify-center text-sm text-muted">
                                            No logo
                                        </div>
                                    )}
                                </div>
                                {uploading && <p className="text-sm mt-2">Subiendo logo…</p>}
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button asChild type="button" variant="outline" className="w-full">
                                    <Link to="/dashboard/companies" className="flex-1">
                                        Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" className="flex-1" disabled={submitting || uploading}>
                                    {preview ? "Save Changes" : "Create Project"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ProjectForm;
