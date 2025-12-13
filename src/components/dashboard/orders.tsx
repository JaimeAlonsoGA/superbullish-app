import React, { useState, useMemo } from "react";
import { TransactionsData } from "@/types/composites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderDetailsModal from "./order-details-modal";
import TransactionsSummary from "./transactions-summary";
import OrderCard from "./order-card";
import { getAggregatedRecordStatus } from "@/lib/status-config";

interface OrdersProps {
    transactions: TransactionsData[];
}

type FilterStatus = "all" | "processing" | "delivered" | "failed";

const Orders: React.FC<OrdersProps> = ({ transactions }) => {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionsData | null>(null);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);

    const handleViewDetails = (transaction: TransactionsData) => {
        setSelectedTransaction(transaction);
        setDetailsModalOpen(true);
    };

    const transactionsWithStatus = useMemo(() => {
        return transactions.map(tx => ({
            ...tx,
            aggregatedStatus: getAggregatedRecordStatus(tx.records).status,
        }));
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        if (statusFilter === "all") return transactionsWithStatus;
        return transactionsWithStatus.filter((tx) => tx.aggregatedStatus === statusFilter);
    }, [transactionsWithStatus, statusFilter]);

    const stats = useMemo(() => {
        const processing = transactionsWithStatus.filter(tx => tx.aggregatedStatus === "processing").length;
        const delivered = transactionsWithStatus.filter(tx => tx.aggregatedStatus === "delivered").length;
        const failed = transactionsWithStatus.filter(tx => tx.aggregatedStatus === "failed").length;

        return {
            total: transactions.length,
            processing,
            delivered,
            failed,
        };
    }, [transactionsWithStatus, transactions.length]);

    return (
        <div className="space-y-6">
            <TransactionsSummary stats={stats} transactions={transactions} />

            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as FilterStatus)}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">
                        All ({stats.total})
                    </TabsTrigger>
                    <TabsTrigger value="processing">
                        Processing ({stats.processing})
                    </TabsTrigger>
                    <TabsTrigger value="delivered">
                        Delivered ({stats.delivered})
                    </TabsTrigger>
                    <TabsTrigger value="failed">
                        Failed ({stats.failed})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter} className="space-y-4 mt-6">
                    {filteredTransactions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No orders found with this status</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredTransactions.map((transaction) => (
                                <OrderCard
                                    key={transaction.id}
                                    transaction={transaction}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            <OrderDetailsModal
                transaction={selectedTransaction}
                open={detailsModalOpen}
                onOpenChange={setDetailsModalOpen}
            />
        </div>
    );
};

export default Orders;