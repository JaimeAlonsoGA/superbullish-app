import { getQueryClient } from "@/lib/react-query/get-query-client";
import { getProjectsByUserId, uploadLogoFile, upsertProject } from "@/services/projects.service";
import { Project, ProjectInsert } from "@/types";
import { UserWithProjectsAndTransactions } from "@/types/composites";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const projectKeys = {
    all: ['projects'] as const,
    list: (userId: string) => [...projectKeys.all, 'by-user', userId] as const,
    detail: (id: string) => [...projectKeys.all, 'detail', id] as const,
};

export function useProjectsByUser(userId?: string) {
    return useQuery<Project[]>({
        queryKey: userId ? projectKeys.list(userId) : projectKeys.all,
        queryFn: async () => {
            if (!userId) return [];
            return getProjectsByUserId({ userId });
        },
        enabled: Boolean(userId),
        staleTime: 60_000,
        retry: 1,
    });
}

export function useUpsertProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ProjectInsert) => {
            return upsertProject(payload);
        },
        retry: false,
        onMutate: async (newProject) => {
            await queryClient.cancelQueries({ queryKey: projectKeys.all });

            const userId = newProject.user_id;
            if (userId) {
                await queryClient.cancelQueries({ queryKey: projectKeys.list(userId) });
                await queryClient.cancelQueries({ queryKey: ['current-user'] });
            }

            const previousProjects = userId
                ? queryClient.getQueryData(projectKeys.list(userId))
                : null;

            const previousUser = queryClient.getQueryData(['current-user']);

            if (userId) {
                queryClient.setQueryData<Project[]>(
                    projectKeys.list(userId),
                    (old = []) => {
                        const existingIndex = old.findIndex(p => p.id === newProject.id);
                        if (existingIndex >= 0) {
                            const updated = [...old];
                            updated[existingIndex] = { ...old[existingIndex], ...newProject } as Project;
                            return updated;
                        }
                        return [...old, newProject as Project];
                    }
                );

                queryClient.setQueryData<any>(['current-user'], (outdatedUser: UserWithProjectsAndTransactions) => {
                    if (!outdatedUser) return outdatedUser;

                    const updatedProjects = outdatedUser.projects?.map((p: Project) =>
                        p.id === newProject.id ? { ...p, ...newProject } : p
                    ) ?? [];

                    if (!outdatedUser.projects?.some((p: Project) => p.id === newProject.id)) {
                        updatedProjects.push(newProject as Project);
                    }

                    return {
                        ...outdatedUser,
                        projects: updatedProjects
                    };
                });
            }

            return { previousProjects, previousUser, userId };
        },
        onError: (_err, _variables, context) => {
            if (context?.userId && context?.previousProjects) {
                queryClient.setQueryData(
                    projectKeys.list(context.userId),
                    context.previousProjects
                );
            }
            if (context?.previousUser) {
                queryClient.setQueryData(['current-user'], context.previousUser);
            }
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({ queryKey: projectKeys.all });
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
            const ownerId = variables?.user_id;
            if (ownerId) {
                queryClient.invalidateQueries({ queryKey: projectKeys.list(ownerId) });
            }
        },
    });
}

export function useUploadProjectLogo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            return uploadLogoFile(file);
        },
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.all });
        },
        onError: (err) => {
            console.error('uploadProjectLogo failed', err);
        },
    });
}

export function resetProjectsCache() {
    const qc = getQueryClient();
    if (!qc) return;

    qc.invalidateQueries({ queryKey: ['projects'] });
    qc.invalidateQueries({ queryKey: ['projects', 'list'] });
    qc.invalidateQueries({ predicate: (query) => String(query.queryKey[0]) === 'projects' });
}