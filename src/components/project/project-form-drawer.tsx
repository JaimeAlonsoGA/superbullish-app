import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Upload } from "lucide-react";

import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";

import {
    InputGroup,
    InputGroupInput,
} from "@/components/ui/input-group";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import { normalizeHex } from "@/lib/utils";
import {
    resetProjectsCache,
    useUploadProjectLogo,
    useUpsertProject,
} from "@/queries/projects.queries";

import {
    ProjectSchema,
    ProjectFormValues,
} from "@/types/schemas/project.schema";
import type { Project } from "@/types";
import { useCurrentUser } from "@/queries/auth.queries";
import ButtonLoading from "../ui/custom/button-loading";
import { toast } from "sonner";

interface Props {
    project?: Project | null;
    trigger?: boolean;
    setClose: (boolean: boolean) => void;
    onSuccess?: (project: Project) => void;
    onError?: (err: any) => void;
}

export default function ProjectFormDrawer({
    project,
    trigger,
    onSuccess,
    onError,
    setClose,
}: Props) {
    const { data: user } = useCurrentUser();
    const { mutateAsync: uploadLogoFile } = useUploadProjectLogo();
    const { mutateAsync: upsertProject } = useUpsertProject();
    const [loading, setLoading] = useState<boolean>(false);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(
        project?.logo_url ?? null
    );

    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(ProjectSchema),
        defaultValues: {
            id: project?.id,
            name: project?.name ?? "",
            ticker: project?.ticker ?? "",
            main_color: project?.main_color ?? "#1D4ED8",
            background_color: project?.background_color ?? "#F3F4F6",
            logo_url: project?.logo_url,
            user_id: project?.user_id,
        },
    });

    useEffect(() => {
        form.reset({
            id: project?.id,
            name: project?.name ?? "",
            ticker: project?.ticker ?? "",
            main_color: project?.main_color ?? "#1D4ED8",
            background_color: project?.background_color ?? "#F3F4F6",
            logo_url: project?.logo_url ?? undefined,
            user_id: project?.user_id ?? undefined,
        });
        setPreview(project?.logo_url ?? null);
        setFile(null);
    }, [project, form]);

    // preview logo
    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleSubmit = form.handleSubmit(async (values) => {
        setLoading(true);
        try {
            values.main_color = normalizeHex(values.main_color);
            values.background_color = normalizeHex(values.background_color);

            if (file) {
                const uploadedUrl = await uploadLogoFile(file);
                values.logo_url = uploadedUrl;
            }

            if (!values.user_id && user?.id) {
                values.user_id = user.id;
            }

            const result = await upsertProject({ ...project, ...values } as any);

            onSuccess?.(result);

            setClose(false);

            toast.success("Project saved successfully!");

        } catch (err) {
            onError?.(err);
            toast.error("Failed to save project");
        } finally {
            setLoading(false);
        }
    });

    const handleDelete = () => {
        toast.error("Project deletion is not implemented yet.");
    }

    return (
        <Drawer open={trigger} onOpenChange={setClose}>
            <DrawerContent className="max-h-[85vh] overflow-hidden">
                <DrawerHeader className="border-b border-muted-foreground/20">
                    <DrawerTitle className="text-xl font-semibold">
                        {project ? "Edit Project" : "Create Project"}
                    </DrawerTitle>
                </DrawerHeader>

                {/* Scrollable content */}
                <div className="px-6 py-6 overflow-y-auto w-full max-w-4xl mx-auto max-h-[65vh]">
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* NAME */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Project name</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    placeholder="Acme Studios"
                                                    className="h-11"
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* TICKER */}
                            <FormField
                                control={form.control}
                                name="ticker"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ticker</FormLabel>
                                        <FormControl>
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    maxLength={6}
                                                    className="uppercase h-11 tracking-wider"
                                                    placeholder="ABC"
                                                    onChange={(e) =>
                                                        field.onChange(e.target.value.toUpperCase())
                                                    }
                                                />
                                            </InputGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* COLORS */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="main_color"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Main Color</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-3">
                                                    <InputGroup>
                                                        <InputGroupInput
                                                            {...field}
                                                            type="color"
                                                            className="h-11 p-1 cursor-pointer"
                                                        />
                                                    </InputGroup>
                                                </div>
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
                                            <FormLabel>Background</FormLabel>
                                            <FormControl>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        {...field}
                                                        value={field.value || "#FFFFFF"}
                                                        type="color"
                                                        className="h-11 p-1 cursor-pointer"
                                                    />
                                                </InputGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* LOGO */}
                            <div className="flex flex-row items-center justify-between">

                                <FormItem className="">
                                    <FormLabel>Logo</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-3 p-3 border border-muted-foreground/20 rounded-xl hover:bg-muted/40 transition cursor-pointer">
                                            <ImageIcon className="h-5 w-5 text-muted-foreground" />

                                            <div className="flex-1 text-sm text-muted-foreground truncate">
                                                {file?.name ?? "Select image…"}
                                            </div>

                                            <label
                                                htmlFor="logo-upload"
                                                className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md text-sm cursor-pointer"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Upload
                                            </label>

                                            <input
                                                id="logo-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                                className="hidden"
                                            />
                                        </div>
                                    </FormControl>


                                    <FormMessage />
                                </FormItem>

                                {preview && (
                                    <img
                                        src={preview}
                                        className="w-20 h-20 mt-3 rounded-lg border border-muted-foreground/20 object-cover"
                                    />
                                )}
                            </div>
                        </form>
                    </Form>
                </div>

                <DrawerFooter className="border-t border-muted-foreground/20 p-4 max-w-4xl mx-auto w-full">
                    <ButtonLoading state={loading} disabled={!preview || loading} loadingLabel="Saving Project" className="w-full h-11" onClick={handleSubmit}>
                        {project ? "Save changes" : "Create Project"}
                    </ButtonLoading>

                    <div className="grid grid-cols-2 gap-2">
                        <DrawerClose asChild>
                            <Button variant="outline">
                                <span>Cancel</span>
                            </Button>
                        </DrawerClose>

                        <Button variant="destructive" disabled={loading || !project} onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >
    );
}
