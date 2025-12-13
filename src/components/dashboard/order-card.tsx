import React from "react";
import { TransactionsData } from "@/types/composites";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, Eye, CheckCircle, Loader2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { getAggregatedRecordStatus, RECORD_STATUS_CONFIG } from "@/lib/status-config";
import type { RecordStatus } from "@/types/definitions";

interface OrderCardProps {
    transaction: TransactionsData;
    onViewDetails?: (transaction: TransactionsData) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ transaction, onViewDetails }) => {
    const aggregated = getAggregatedRecordStatus(transaction.records);
    const statusConfig = RECORD_STATUS_CONFIG[aggregated.status];
    const recordsCount = transaction.records?.length || 0;

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
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <CardTitle className="text-lg flex items-center gap-2">
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
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {formatDate(transaction.created_at)}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                            {transaction.total.toFixed(4)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {transaction.blockchainNetwork?.symbol ?? 'ETH'}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Network</span>
                    <Badge variant="outline">
                        {transaction.blockchainNetwork?.name ?? 'Unknown'}
                    </Badge>
                </div>

                {/* Transaction Hash */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Transaction</span>
                    <a
                        href={`${transaction.blockchainNetwork?.block_explorer}/tx/${transaction.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                    >
                        {transaction.tx_hash.slice(0, 10)}...{transaction.tx_hash.slice(-8)}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                <Separator />

                {/* <div className="text-sm text-center py-2">
                    <p className="text-muted-foreground">{aggregated.description}</p>
                </div> */}

                <div className="space-y-2">
                    {transaction.records?.slice(0, 2).map((record) => (
                        <div
                            key={record.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-card border border-app hover:bg-accent/20"
                        >
                            <img
                                src={record.template.thumbnail_url}
                                alt={record.template.name}
                                className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{record.template.name}</p>
                                <Badge
                                    variant="secondary"
                                    style={{ backgroundColor: record.project.main_color }}
                                    className="text-xs mt-1"
                                >
                                    {record.project.ticker}
                                </Badge>
                            </div>
                            <Badge
                                variant={record.status === 'delivered' ? 'default' : record.status === 'failed' ? 'destructive' : 'secondary'}
                                className="text-xs"
                            >
                                {getStatusIcon(record.status as RecordStatus)}
                            </Badge>
                        </div>
                    ))}
                    {recordsCount > 2 && (
                        <p className="text-xs text-center text-muted-foreground">
                            +{recordsCount - 2} more item{recordsCount - 2 > 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 pt-2">
                    {aggregated.canDownload && (
                        <Button variant="default" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => onViewDetails?.(transaction)}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderCard;