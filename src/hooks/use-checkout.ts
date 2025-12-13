import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAccount, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { useCart } from '@/providers/cart-provider';
import { useTemplatePrice } from './use-template-price';
import { useCreateTransaction } from '@/queries/transactions.queries';
import { useNavigate } from 'react-router-dom';
import { useRefreshUser } from '@/queries/auth.queries';

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

const ADMIN_ADDRESS = "0xc5e62133b221b785d6c5a30e3300b76d5d44476e";

export function useCheckout(): UseCheckoutReturn {
    const { address, chain } = useAccount();
    const { items, clearCart } = useCart();
    const { data: balance } = useBalance({ address });
    const { sendTransactionAsync } = useSendTransaction();
    const { mutateAsync: createTransactionAsync } = useCreateTransaction();
    const navigate = useNavigate();

    const [state, setState] = useState<CheckoutState>({ status: 'idle' });
    const processedTxRef = useRef<string | null>(null);

    const itemPrices = items.map(item => {
        const { priceNative } = useTemplatePrice(item.template.price);
        return priceNative ?? 0;
    });

    const totalNative = useMemo(() => {
        return itemPrices.reduce((sum, price) => sum + price, 0);
    }, [itemPrices]);

    const { isSuccess: isConfirmed, isError: confirmError } = useWaitForTransactionReceipt({
        hash: state.transactionHash as `0x${string}` | undefined,
        confirmations: 1,
    });

    const formattedTotal = `${totalNative.toFixed(4)} ${chain?.nativeCurrency?.symbol ?? ''}`;
    const userBalance = balance ? Number(balance.value) / 10 ** balance.decimals : 0;
    const canAfford = userBalance >= totalNative;
    const missingAmount = canAfford ? null : totalNative - userBalance;
    const formattedBalance = balance ? `${userBalance.toFixed(4)} ${balance.symbol}` : '0';

    // Handle confirmed transaction
    useEffect(() => {
        if (
            state.status === 'processing' &&
            isConfirmed &&
            state.transactionHash &&
            processedTxRef.current !== state.transactionHash
        ) {
            processedTxRef.current = state.transactionHash;

            createTransactionAsync({
                items,
                transactionHash: state.transactionHash,
                chainId: chain!.id,
                amount: totalNative,
            }).then(() => {
                setState({ status: 'success', transactionHash: state.transactionHash });
                toast.dismiss();
                toast.success('Payment successful! Videos are being processed 🎉');
                clearCart();
                useRefreshUser();
                navigate('/dashboard');
            }).catch((err) => {
                console.error('Failed to record transaction:', err);
                setState({ status: 'error', error: 'Failed to record transaction' });
                toast.dismiss();
                toast.error('Transaction succeeded but failed to record. Contact support.');
            });
        }
    }, [state.status, isConfirmed, state.transactionHash, createTransactionAsync, items, chain, totalNative, clearCart]);

    // Handle blockchain confirmation error
    useEffect(() => {
        if (state.status === 'processing' && confirmError) {
            setState({ status: 'error', error: 'Transaction failed to confirm' });
            toast.dismiss();
            toast.error('Transaction failed on blockchain');
        }
    }, [state.status, confirmError]);

    const handleCheckout = useCallback(async () => {
        if (!address || !chain) {
            toast.error('Please connect your wallet');
            return;
        }

        if (!canAfford) {
            toast.error(`Insufficient funds. You need ${missingAmount?.toFixed(4)} more ${chain.nativeCurrency?.symbol}`);
            return;
        }

        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        try {
            processedTxRef.current = null;
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
            toast.loading('Confirming transaction on blockchain...');

        } catch (error: any) {
            console.error('Checkout error:', error);
            setState({ status: 'error', error: error.message || 'Transaction failed' });
            toast.dismiss();
            toast.error('Transaction failed. Please try again.');
        }
    }, [address, chain, items, canAfford, totalNative, missingAmount, sendTransactionAsync]);

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