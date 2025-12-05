import { useState, useCallback } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { useCart } from '@/providers/cart-provider';
import { useTemplatePrice } from './use-template-price';
import { CartItem } from '@/types/composites';
import { useCreateTransaction } from '@/queries/transactions.queries';

interface CheckoutState {
    status: 'idle' | 'preparing' | 'confirming' | 'processing' | 'success' | 'error';
    transactionHash?: string;
    error?: string;
}

interface UseCheckoutReturn {
    state: CheckoutState;
    totalNative: number;
    canAfford: boolean;
    missingAmount: number | null;
    formattedTotal: string;
    formattedBalance: string;
    handleCheckout: () => Promise<void>;
    isProcessing: boolean;
}

const ADMIN_ADDRESS = "0x11e4ffcd8f36361db5d10c2d34984cd026f10085";

export function useCheckout(): UseCheckoutReturn {
    const { address, chain } = useAccount();
    // const { data: adminWallet, isLoading: loadingWallet } = useAdminWallet(chain?.id);
    const { items, clearCart } = useCart();
    const { data: balance } = useBalance({ address });
    const { sendTransactionAsync } = useSendTransaction();
    const createTransaction = useCreateTransaction();

    const [state, setState] = useState<CheckoutState>({
        status: 'idle'
    });

    const { totalNative, formattedTotal } = calculateTotals(items);

    const userBalance = balance
        ? Number(balance.value) / 10 ** balance.decimals
        : 0;

    const canAfford = userBalance >= totalNative;
    const missingAmount = canAfford ? null : totalNative - userBalance;

    const formattedBalance = balance
        ? `${userBalance.toFixed(4)} ${balance.symbol}`
        : '0';

    const handleCheckout = useCallback(async () => {
        if (!address || !chain) {
            toast.error('Please connect your wallet');
            return;
        }

        if (!canAfford) {
            toast.error(`Insufficient funds. You need ${missingAmount?.toFixed(4)} more ${chain.name}`);
            return;
        }

        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            setState({ status: 'preparing' });
            toast.loading('Preparing transaction...');

            if (!ADMIN_ADDRESS) {
                throw new Error('Admin wallet not configured for this network');
            }

            setState({ status: 'confirming' });
            toast.dismiss();
            toast.loading('Confirm transaction in your wallet...');

            const txHash = await sendTransactionAsync({
                to: ADMIN_ADDRESS as `0x${string}`,
                value: parseEther(totalNative.toString()),
            });

            setState({ status: 'processing', transactionHash: txHash });
            toast.dismiss();
            toast.loading('Processing transaction...');

            await waitForTransactionConfirmation(txHash);

            await createTransaction.mutateAsync({
                items,
                transactionHash: txHash,
                chainId: chain.id,
                amount: totalNative,
            });

            setState({ status: 'success', transactionHash: txHash });
            toast.dismiss();
            toast.success('Payment successful! 🎉');

            clearCart();

        } catch (error: any) {
            console.error('Checkout error:', error);
            setState({
                status: 'error',
                error: error.message || 'Transaction failed'
            });
            toast.dismiss();
            toast.error('Transaction failed. Please try again.');
        }
    }, [address, chain, items, canAfford, totalNative, missingAmount]);

    return {
        state,
        totalNative,
        canAfford,
        missingAmount,
        formattedTotal,
        formattedBalance,
        handleCheckout,
        isProcessing: ['preparing', 'confirming', 'processing'].includes(state.status),
    };
}

// Helpers
function calculateTotals(items: CartItem[]) {
    const totalNative = items.reduce((sum, item) => {
        const { priceNative } = useTemplatePrice(item.template.price);
        return sum + (priceNative ?? 0);
    }, 0);

    const formattedTotal = `${totalNative.toFixed(4)}`;

    return { totalNative, formattedTotal };
}

async function waitForTransactionConfirmation(hash: `0x${string}`): Promise<void> {
    useWaitForTransactionReceipt({
        hash,
        confirmations: 1,
    });
}