import { QueryClient } from '@tanstack/react-query'

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
    if (!browserQueryClient) {
        browserQueryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                },
            },
        });
    }
    return browserQueryClient;
}