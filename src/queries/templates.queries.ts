import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getVideoTemplates } from '@/services/templates.service';
import { Template } from '@/types';

export const VIDEO_TEMPLATES_QUERY_KEY = ['video-templates'] as const;

export function useTemplates(
): UseQueryResult<Template[], Error> {
    return useQuery<Template[], Error>({
        queryKey: VIDEO_TEMPLATES_QUERY_KEY,
        queryFn: () => getVideoTemplates(),
        staleTime: 1000 * 60 * 20, // 20 minutes
    });
}