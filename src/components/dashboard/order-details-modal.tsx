import React from "react";
import { TransactionsData } from "@/types/composites";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    CheckCircle,
    Download,
    ExternalLink,
    Eye,
    Loader2,
    XCircle,
    AlertCircle,
} from "lucide-react";
import OrderProgress from "./order-progress";
import { formatDate } from "@/lib/utils";
import type { RecordStatus } from "@/types/definitions";
import { getAggregatedRecordStatus, RECORD_STATUS_CONFIG, TRANSACTION_STATUS_CONFIG } from "@/lib/status-config";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OrderDetailsModalProps {
    transaction: TransactionsData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
    transaction,
    open,
    onOpenChange,
}) => {
    if (!transaction) return null;

    const aggregated = getAggregatedRecordStatus(transaction.records);
    const statusConfig = RECORD_STATUS_CONFIG[aggregated.status];
    const txStatusConfig = TRANSACTION_STATUS_CONFIG[transaction.status];

    const getStatusIcon = (status: RecordStatus) => {
        switch (status) {
            case 'processing':
                return <Loader2 className="w-4 h-4 animate-spin" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'failed':
                return <XCircle className="w-4 h-4" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Order #{transaction.id.slice(0, 8)}
                        <Badge
                            variant={aggregated.status === 'delivered' ? 'default' : aggregated.status === 'failed' ? 'destructive' : 'secondary'}
                            className="ml-2"
                        >
                            <span className="flex items-center gap-1">
                                {getStatusIcon(aggregated.status)}
                                {statusConfig.label}
                            </span>
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        {formatDate(transaction.created_at)}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Order Progress */}
                    <div className="bg-card border border-app p-6 rounded-lg">
                        <h4 className="font-semibold mb-4 text-center">Order Status</h4>
                        <OrderProgress recordStatus={aggregated.status} />
                        <p className="text-center text-sm text-muted-foreground mt-4">
                            {aggregated.description}
                        </p>
                    </div>

                    {/* Stats Summary */}
                    {aggregated.totalCount > 1 && (
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-3 rounded-lg bg-green-500/10">
                                <p className="text-2xl font-bold text-green-500">{aggregated.deliveredCount}</p>
                                <p className="text-xs text-muted-foreground">Delivered</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-blue-500/10">
                                <p className="text-2xl font-bold text-blue-500">{aggregated.processingCount}</p>
                                <p className="text-xs text-muted-foreground">Processing</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-red-500/10">
                                <p className="text-2xl font-bold text-red-500">{aggregated.failedCount}</p>
                                <p className="text-xs text-muted-foreground">Failed</p>
                            </div>
                        </div>
                    )}

                    {/* Warning if blockchain tx failed (edge case) */}
                    {transaction.status === 'failed' && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                This transaction failed on the blockchain. If you were charged, please contact support with the transaction hash below.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Transaction Details */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Transaction Details</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Network</span>
                                <Badge variant="outline">
                                    {transaction.blockchainNetwork?.name ?? 'Unknown'}
                                </Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount</span>
                                <span className="font-medium">
                                    {transaction.total.toFixed(4)} {transaction.blockchainNetwork?.symbol ?? 'ETH'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Transaction Hash</span>
                                <a
                                    href={`${transaction.blockchainNetwork?.block_explorer}/tx/${transaction.tx_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    View <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Blockchain Status</span>
                                <Badge variant={transaction.status === 'success' ? 'default' : 'destructive'}>
                                    {txStatusConfig.label}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Videos List */}
                    <div className="space-y-3">
                        <h4 className="font-semibold">Videos ({aggregated.totalCount})</h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {transaction.records?.map((record) => {
                                const recordConfig = RECORD_STATUS_CONFIG[record.status as RecordStatus];
                                const canDownload = record.status === 'delivered';

                                return (
                                    <div
                                        key={record.id}
                                        className="flex gap-3 p-3 rounded-lg border bg-card"
                                    >
                                        <img
                                            src={record.template.thumbnail_url}
                                            alt={record.template.name}
                                            className="w-20 h-20 rounded object-cover shrink-0"
                                        />
                                        <div className="flex-1 min-w-0 space-y-1.5">
                                            <p className="font-medium truncate">{record.template.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {record.template.category}
                                            </p>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge
                                                    variant="secondary"
                                                    style={{ backgroundColor: record.project.main_color }}
                                                    className="text-xs text-white"
                                                >
                                                    {record.project.ticker}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {record.project.name}
                                                </span>
                                            </div>
                                            <Badge
                                                variant={record.status === 'delivered' ? 'default' : record.status === 'failed' ? 'destructive' : 'secondary'}
                                                className="text-xs"
                                            >
                                                <span className="flex items-center gap-1">
                                                    {getStatusIcon(record.status as RecordStatus)}
                                                    {recordConfig.label}
                                                </span>
                                            </Badge>
                                        </div>
                                        {canDownload && (
                                            <div className="flex flex-col gap-2 shrink-0">
                                                <Button size="sm" variant="outline">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm">
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Download Actions */}
                    {aggregated.canDownload && (
                        <>
                            <Separator />
                            <div className="flex gap-2">
                                <Button className="flex-1" disabled={aggregated.deliveredCount === 0}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download {aggregated.status === 'delivered'
                                        ? `All Videos (${aggregated.deliveredCount})`
                                        : `Ready Videos (${aggregated.deliveredCount})`
                                    }
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default OrderDetailsModal;