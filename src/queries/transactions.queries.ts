import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItem } from "@/types/composites";
import { Transaction } from "@/types";
import {
    createTransactionWithRecords,
    updateTransactionStatus,
    getTransactionsByUser
} from "@/services/transactions.service";
import { useCurrentUser } from "./auth.queries";

export const transactionKeys = {
    all: ['transactions'] as const,
    byUser: (userId: string) => [...transactionKeys.all, 'user', userId] as const,
    detail: (id: string) => [...transactionKeys.all, 'detail', id] as const,
};

interface CreateTransactionInput {
    items: CartItem[];
    transactionHash: string;
    chainId: number;
    amount: number;
}

export function useCreateTransaction() {
    const queryClient = useQueryClient();
    const { data: user } = useCurrentUser();

    return useMutation({
        mutationFn: async (input: CreateTransactionInput) => {
            if (!user?.id) {
                throw new Error('User not authenticated');
            }

            return createTransactionWithRecords({
                ...input,
                userId: user.id,
            });
        },
        onSuccess: () => {
            if (user?.id) {
                queryClient.invalidateQueries({
                    queryKey: transactionKeys.byUser(user.id)
                });
            }
            queryClient.invalidateQueries({
                queryKey: ['current-user']
            });
        },
        onError: (error) => {
            console.error('Transaction creation failed:', error);
        },
    });
}

export function useUpdateTransactionStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            transactionId,
            status
        }: {
            transactionId: string;
            status: 'pending' | 'confirmed' | 'failed'
        }) => {
            return updateTransactionStatus(transactionId, status);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: transactionKeys.detail(variables.transactionId)
            });
            queryClient.invalidateQueries({
                queryKey: transactionKeys.all
            });
        },
    });
}

export function useUserTransactions() {
    const { data: user } = useCurrentUser();

    return useQuery<Transaction[]>({
        queryKey: user?.id ? transactionKeys.byUser(user.id) : transactionKeys.all,
        queryFn: async () => {
            if (!user?.id) return [];
            return getTransactionsByUser(user.id);
        },
        enabled: Boolean(user?.id),
        staleTime: 30_000, // 30 seconds
    });
}