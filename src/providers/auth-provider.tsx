import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import {
    useSession,
    useUser,
    useSignInWithWeb3,
    useSignUp,
    useSignOut,
    useResetPassword,
    useUpdatePassword,
    useRefreshUser,
    useSignInWithOAuth,
    authKeys
} from '@/queries/auth.queries';
import { useAccount, useDisconnect } from 'wagmi';

interface AuthContextType {
    // Auth state (from queries)
    user: ReturnType<typeof useUser>['data'];
    session: ReturnType<typeof useSession>['data'];
    loading: boolean;

    // Auth methods (from mutations)
    signIn: ReturnType<typeof useSignInWithWeb3>['mutateAsync'];
    signUp: ReturnType<typeof useSignUp>['mutateAsync'];
    signOut: () => Promise<void>;
    resetPassword: ReturnType<typeof useResetPassword>['mutateAsync'];
    updatePassword: ReturnType<typeof useUpdatePassword>['mutateAsync'];
    signInWithGoogle: () => Promise<any>;
    signInWithApple: () => Promise<any>;

    // Utility methods
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;

    // Loading states for mutations
    isSigningIn: boolean;
    isSigningUp: boolean;
    isSigningOut: boolean;
    isSigningInWithOAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    //Wagmi account
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    // Queries
    const sessionQuery = useSession();
    const userQuery = useUser();
    // const userWithRolesQuery = useUserWithRoles();

    // Mutations
    const signInMutation = useSignInWithWeb3();
    const signUpMutation = useSignUp();
    const signOutMutation = useSignOut();
    const resetPasswordMutation = useResetPassword();
    const updatePasswordMutation = useUpdatePassword();
    const refreshUserMutation = useRefreshUser();
    const signInWithOAuthMutation = useSignInWithOAuth();

    // Auto sign-in effect when wallet connects
    useEffect(() => {
        if (!isConnected || !address) return;
        if (sessionQuery.data?.user) return;
        if (signInMutation.isPending || signInMutation.isSuccess) return;

        // Attempt sign-in and disconnect on failure
        signInMutation.mutateAsync().catch(() => {
            disconnect();
        });
    }, [isConnected, address, sessionQuery.data?.user, signInMutation]);

    // Auto sign-out effect when wallet disconnects
    useEffect(() => {
        if (isConnected) return;
        if (!sessionQuery.data?.user) return;
        if (signOutMutation.isPending || signOutMutation.isSuccess) return;

        signOutMutation.mutateAsync().catch(() => {
            disconnect();
        });
    }, [isConnected, sessionQuery.data?.user, signOutMutation]);

    // Setup auth state change listener
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {

                if (event === 'SIGNED_OUT') {
                    queryClient.removeQueries({ queryKey: authKeys.session() });
                    queryClient.removeQueries({ queryKey: authKeys.user() });
                    queryClient.removeQueries({ queryKey: authKeys.currentUser() });
                    return;
                }

                if (session) {
                    queryClient.setQueryData(authKeys.session(), session);
                    queryClient.setQueryData(authKeys.user(), session.user);

                    queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
                }

                if (!session) {
                    queryClient.removeQueries({ queryKey: authKeys.session() });
                    queryClient.removeQueries({ queryKey: authKeys.user() });
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [queryClient]);

    // Enhanced sign out function
    const handleSignOut = async () => {
        await signOutMutation.mutateAsync();
    };

    // OAuth sign in handlers
    const handleSignInWithGoogle = () => signInWithOAuthMutation.mutateAsync('google');
    const handleSignInWithApple = () => signInWithOAuthMutation.mutateAsync('apple');

    // Enhanced refresh user function
    const handleRefreshUser = async () => {
        await refreshUserMutation.mutateAsync();
    };

    // Determine overall loading state
    const loading = sessionQuery.isLoading ||
        (!!sessionQuery.data && userQuery.isLoading);
    // (!!userQuery.data && userWithRolesQuery.isLoading);

    // More reliable authentication check
    const isAuthenticated = !!sessionQuery.data?.user && !!userQuery.data && isConnected;

    const value: AuthContextType = {
        // Auth state
        user: userQuery.data || null,
        // userWithRoles: userWithRolesQuery.data || null,
        session: sessionQuery.data || null,
        loading,

        // Auth methods
        signIn: signInMutation.mutateAsync,
        signUp: signUpMutation.mutateAsync,
        signOut: handleSignOut,
        resetPassword: resetPasswordMutation.mutateAsync,
        updatePassword: updatePasswordMutation.mutateAsync,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithApple: handleSignInWithApple,

        // Utility methods
        refreshUser: handleRefreshUser,
        isAuthenticated,

        // Loading states
        isSigningIn: signInMutation.isPending,
        isSigningUp: signUpMutation.isPending,
        isSigningOut: signOutMutation.isPending,
        isSigningInWithOAuth: signInWithOAuthMutation.isPending,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}