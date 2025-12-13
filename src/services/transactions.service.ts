import { supabase } from "@/lib/supabase/client";
import { Transaction, TransactionInsert, Record, RecordInsert } from "@/types";
import { CartItem } from "@/types/composites";
import { RecordStatus, TransactionStatus } from "@/types/definitions";

interface CreateTransactionParams {
    items: CartItem[];
    transactionHash: string;
    chainId: number;
    amount: number;
    userId: string;
}

export async function createTransactionWithRecords(
    params: CreateTransactionParams
): Promise<Transaction> {
    const { items, transactionHash, chainId, amount, userId } = params;

    const { data: chain } = await supabase
        .from('blockchain_networks')
        .select('*')
        .eq('chain_id', chainId)
        .single();

    if (!chain) {
        throw new Error('Unsupported blockchain network');
    }

    const transactionData: TransactionInsert = {
        user_id: userId,
        tx_hash: transactionHash,
        blockchain_network_id: chain.id,
        total: amount,
        status: 'success' as TransactionStatus,
        created_at: new Date().toISOString(),
    };

    const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();

    if (txError) {
        console.error('Error creating transaction:', txError);
        throw new Error('Failed to create transaction');
    }

    const recordsData: RecordInsert[] = items.map(item => ({
        transaction_id: transaction.id,
        template_id: item.template.id,
        project_id: item.project.id,
        dual_project_id: null,
        background_color: item.backgroundColor,
        headline: item.headline,
        subheadline: item.subheadline,
        status: 'processing' as RecordStatus,
        order_number: item.id,
    }));

    const { error: recordsError } = await supabase
        .from('records')
        .insert(recordsData);

    if (recordsError) {
        console.error('Error creating records:', recordsError);
        throw new Error('Failed to create records');
    }

    const { error: logError } = await supabase
        .from('payment_logs')
        .insert({
            transaction_id: transaction.id,
            event_type: 'transaction_created',
            details: {
                items_count: items.length,
                chain_id: chainId,
            },
            created_at: new Date().toISOString(),
        });

    if (logError) {
        console.error('Error creating payment log:', logError);
    }

    return transaction;
}

export async function updateTransactionStatus(
    transactionId: string,
    status: TransactionStatus
): Promise<void> {
    const { error } = await supabase
        .from('transactions')
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq('id', transactionId);

    if (error) {
        console.error('Error updating transaction status:', error);
        throw new Error('Failed to update transaction status');
    }
}

export async function updateRecordStatus(
    recordId: string,
    status: RecordStatus
): Promise<void> {
    const { error } = await supabase
        .from('records')
        .update({ status })
        .eq('id', recordId);

    if (error) {
        console.error('Error updating record status:', error);
        throw new Error('Failed to update record status');
    }
}

export async function getTransactionsByUser(
    userId: string
): Promise<Transaction[]> {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }

    return data || [];
}

export async function getAdminWalletAddress(chainId: number): Promise<string | null> {
    const { data, error } = await supabase
        .from('admin_wallets')
        .select('wallet_address')
        .eq('chain_id', chainId)
        .eq('is_active', true)
        .single();

    if (error) {
        console.error('Error fetching admin wallet:', error);
        return null;
    }

    return data?.wallet_address || null;
}