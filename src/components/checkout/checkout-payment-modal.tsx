import React from 'react';
import { CheckCircle, Loader2, XCircle, Wallet, Shield, Lock } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCheckout } from '@/hooks/use-checkout';
import { useAccount } from 'wagmi';

interface CheckoutPaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
    open,
    onOpenChange,
}) => {
    const { chain } = useAccount();
    const {
        state,
        canAfford,
        missingAmount,
        formattedTotal,
        formattedBalance,
        handleCheckout,
        isProcessing,
    } = useCheckout();

    const getStatusContent = () => {
        switch (state.status) {
            case 'preparing':
                return {
                    icon: <Loader2 className="w-12 h-12 animate-spin text-primary" />,
                    title: 'Preparing Transaction',
                    description: 'Setting up your payment...',
                };
            case 'confirming':
                return {
                    icon: <Loader2 className="w-12 h-12 animate-spin text-primary" />,
                    title: 'Confirm in Wallet',
                    description: 'Please confirm the transaction in your wallet',
                };
            case 'processing':
                return {
                    icon: <Loader2 className="w-12 h-12 animate-spin text-primary" />,
                    title: 'Processing Payment',
                    description: 'Your transaction is being confirmed on the blockchain...',
                };
            case 'success':
                return {
                    icon: <CheckCircle className="w-12 h-12 text-green-500" />,
                    title: 'Payment Successful!',
                    description: 'Your videos will be ready shortly',
                };
            case 'error':
                return {
                    icon: <XCircle className="w-12 h-12 text-destructive" />,
                    title: 'Transaction Failed',
                    description: state.error || 'Something went wrong. Please try again.',
                };
            default:
                return null;
        }
    };

    const statusContent = getStatusContent();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md border-app">
                <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                    <DialogDescription>
                        Review your order and complete the payment
                    </DialogDescription>
                </DialogHeader>

                {statusContent ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        {statusContent.icon}
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-semibold">{statusContent.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {statusContent.description}
                            </p>
                            {state.status === 'processing' && state.transactionHash && (
                                <a
                                    href={`https://etherscan.io/tx/${state.transactionHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline"
                                >
                                    View on Explorer
                                </a>
                            )}
                        </div>
                        {state.status === 'success' && (
                            <Button onClick={() => onOpenChange(false)} className="mt-4">
                                Done
                            </Button>
                        )}
                        {state.status === 'error' && (
                            <Button onClick={() => handleCheckout()} variant="outline">
                                Retry
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="rounded-lg border p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Network</span>
                                <Badge variant="outline">{chain?.name}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Total</span>
                                <span className="text-lg font-bold text-primary">
                                    {formattedTotal}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-lg border border-dashed border-primary p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Wallet className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Your Balance</span>
                                </div>
                                <span className="font-medium">{formattedBalance}</span>
                            </div>
                            {!canAfford && missingAmount && (
                                <p className="text-sm text-destructive">
                                    Insufficient funds. You need {missingAmount.toFixed(4)} more {chain?.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-start gap-2">
                                <Shield className="w-4 h-4 mt-0.5 text-primary" />
                                <span>Secure payment processed directly on the blockchain</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <Lock className="w-4 h-4 mt-0.5 text-primary" />
                                <span>Your funds are protected by smart contract technology</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            disabled={!canAfford || isProcessing}
                            className="w-full"
                            size="lg"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Wallet className="w-4 h-4 mr-2" />
                                    Pay {formattedTotal} {chain?.name}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutPaymentModal;