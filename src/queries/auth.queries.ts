import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { checkIfThereIsPublicUser, getCurrentUser } from '@/services/users.service';
import { User } from '@/types';
import { UserWithProjectsAndTransactions } from '@/types/composites';

// Query Keys
export const authKeys = {
    all: ['auth'] as const,
    session: () => [...authKeys.all, 'session'] as const,
    user: () => [...authKeys.all, 'user'] as const,
    currentUser: () => [...authKeys.all, 'currentUser'] as const,
};

interface SignUpCredentials {
    email: string;
    password: string;
    metadata?: Record<string, any>;
    emailRedirectTo?: string;
}

interface AuthResult {
    success: boolean;
    error?: string;
    data?: any;
}

// Session Query
export function useSession() {
    return useQuery({
        queryKey: authKeys.session(),
        queryFn: async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            return session;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
}

// User Query
export function useUser() {
    const { data: session } = useSession();

    return useQuery({
        queryKey: authKeys.user(),
        queryFn: () => session?.user || null,
        enabled: !!session,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

// User with Roles Query
export function useCurrentUser() {
    const { data: user } = useUser();

    return useQuery({
        queryKey: authKeys.currentUser(),
        queryFn: async (): Promise<UserWithProjectsAndTransactions | null> => {
            if (!user) return null;
            try {
                return await getCurrentUser(supabase);
            } catch (error) {
                console.error('Error fetching user with roles:', error);
                return null;
            }
        },
        enabled: !!user,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

export function useCheckIfThereIsPublicUser() {
    const user = useUser();
    return useQuery({
        queryKey: ['auth', 'public-user'],
        queryFn: async (): Promise<boolean> => {
            if (!user) return false;
            return await checkIfThereIsPublicUser(user.data?.id!);
        },
    });
}

export async function signInWithWeb3(): Promise<any> {
    const { data, error } = await supabase.auth.signInWithWeb3({
        chain: 'ethereum',
        statement: 'Sign in to the application',
    });
    if (error) throw error;
    // console.log('signInWithWeb3 data:', data);
    return data;
}

export function useSignInWithWeb3() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: signInWithWeb3,
        retry: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
        onError: (err) => {
            console.error('signInWithWeb3 failed', err);
        },
    });
}

// Sign Up Mutation
export function useSignUp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (credentials: SignUpCredentials): Promise<AuthResult> => {
            try {
                const authResult = await supabase.auth.signUp({
                    email: credentials.email,
                    password: credentials.password,
                    options: {
                        emailRedirectTo: credentials.emailRedirectTo,
                        data: {
                            ...credentials.metadata,
                            profile_completed: false,
                        }
                    }
                });

                if (authResult.error) {
                    return { success: false, error: authResult.error.message };
                }

                // Manually sign in the user after successful sign-up if email confirmation is not required
                if (authResult.data.user && !authResult.data.user.identities?.length) {
                    const signInResult = await supabase.auth.signInWithPassword({
                        email: credentials.email,
                        password: credentials.password,
                    });

                    if (signInResult.error) {
                        return { success: false, error: signInResult.error.message };
                    }
                }

                return { success: true, data: authResult.data };
            } catch (error) {
                console.error('Sign up error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Sign up failed'
                };
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
}

// OAuth Sign In Mutation
export function useSignInWithOAuth() {
    return useMutation({
        mutationFn: async (provider: 'google' | 'apple'): Promise<AuthResult> => {
            try {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider,
                    options: {
                        redirectTo: `${window.location.origin}/`,
                    },
                });

                if (error) {
                    return { success: false, error: error.message };
                }

                return { success: true };
            } catch (error) {
                console.error(`OAuth sign in error (${provider}):`, error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : `Sign in with ${provider} failed`
                };
            }
        }
    });
}

// Sign Out Mutation
export function useSignOut() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        },
        onMutate: () => {
            // Immediately clear auth data from cache (optimistic update)
            queryClient.setQueryData(authKeys.session(), null);
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.setQueryData(authKeys.currentUser(), null);
        },
        onSuccess: () => {
            console.log('Sign out successful');
            // Ensure all auth data is cleared and invalidate queries
            queryClient.setQueryData(authKeys.session(), null);
            queryClient.setQueryData(authKeys.user(), null);
            queryClient.setQueryData(authKeys.currentUser(), null);
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
        onError: () => {
            // If sign out fails, refetch current auth state
            queryClient.invalidateQueries({ queryKey: authKeys.all });
        },
    });
}

// Reset Password Mutation
export function useResetPassword() {
    return useMutation({
        mutationFn: async (email: string): Promise<AuthResult> => {
            try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });

                if (error) {
                    return { success: false, error: error.message };
                }

                return { success: true };
            } catch (error) {
                console.error('Reset password error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Reset password failed'
                };
            }
        },
    });
}

// Update Password Mutation
export function useUpdatePassword() {
    return useMutation({
        mutationFn: async (password: string): Promise<AuthResult> => {
            try {
                const { error } = await supabase.auth.updateUser({ password });

                if (error) {
                    return { success: false, error: error.message };
                }

                return { success: true };
            } catch (error) {
                console.error('Update password error:', error);
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Update password failed'
                };
            }
        },
    });
}

// Refresh User Data
export function useRefreshUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            // Simply invalidate to trigger refetch
            await queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
        },
    });
}
