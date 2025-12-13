import type { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
// import { UserWithStrategy } from '@/types/composites';
import { User } from '@/types';
import { UserWithProjectsAndTransactions } from '@/types/composites';

/**
 * Fetches the authenticated user from Supabase.
 * @param supabase - Supabase client instance
 * @returns Authenticated user or null
 */
export async function getAuthUser(supabase: SupabaseClient): Promise<SupabaseUser | null> {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error('Error fetching auth user:', error);
        return null;
    }
    return data.user || null;
}

/**
 * Fetches user data with strategy from the database
 * @param supabase - Supabase client instance
 * @param userId - User ID to fetch data for
 * @returns User data with strategy
 */

//Composite user fetching
export async function fetchUserWithProjectsAndTransactions(
    supabase: SupabaseClient,
    userId: string
): Promise<UserWithProjectsAndTransactions> {
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', userId)
        .single<User>();

    if (userError || !user) {
        throw new Error(`Error fetching user data: ${userError?.message ?? 'User not found'}`);
    }

    // projects owned by the user
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);

    if (projectsError) {
        console.error('Error fetching projects:', projectsError);
    }

    // transactions with the related record and its template
    const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
            *, 
            records:records(
                *, 
                template:templates(*), 
                project:projects!records_project_id_fkey(*),
                dual_project:projects!records_dual_project_id_fkey(*)
            ), 
            blockchainNetwork:blockchain_networks(*)
        `)
        .eq('user_id', user.id);

    if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
    }

    return {
        ...user,
        projects: projects ?? null,
        transactions: transactions ?? null,
    };
}

/**
 * Gets the current authenticated user's data for React client
 * @param supabase The Supabase client
 * @returns The user's data with their strategy
 */
export async function getCurrentUser(supabase: SupabaseClient): Promise<UserWithProjectsAndTransactions> {
    const user = await getAuthUser(supabase);
    if (!user) {
        throw new Error('No authenticated user found');
    }
    return fetchUserWithProjectsAndTransactions(supabase, user.id);
}

export async function checkIfThereIsPublicUser(userId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .limit(1);

    if (error) {
        console.error('Error checking for public user:', error);
        return false;
    }

    return data && data.length > 0;
}

/**
 * Updates user data
 * @param supabase - Supabase client instance
 * @param userId - User ID to update
 * @param updates - Updates to apply
 * @returns Updated user data
 */
export async function updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Deletes a user
 * @param supabase - Supabase client instance
 * @param userId - User ID to delete
 */
export async function deleteUser(userId: string) {
    const { error } = await supabase
        .from('users')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', userId);

    if (error) throw error;
}
