import type { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wwfqksdhtovygfjeodra.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZnFrc2RodG92eWdmamVvZHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NzM5ODMsImV4cCI6MjA2NjA0OTk4M30.PZldFF_xsWpNIqIQXVquTNE_d6pSXzt6ScD8-iXuMV0';

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export function clearAuthCookies() {
    if (typeof document !== 'undefined') {
        // Clear any auth-related cookies that might exist
        const cookiesToClear = [
            'sb-auth-token',
            'sb-auth-token.0',
            'sb-auth-token.1',
        ];

        cookiesToClear.forEach((cookieName) => {
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
            document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
        });
    }
}