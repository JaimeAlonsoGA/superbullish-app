import React from "react";
import { TransactionsData } from "@/types/composites";
import { Card, CardContent } from "@/components/ui/card";
import {
    Package,
    CheckCircle,
    Clock,
    Wallet,
    TrendingUp
} from "lucide-react";

interface TransactionsSummaryProps {
    stats: {
        total: number;
        processing: number;
        delivered: number;
    };
    transactions: TransactionsData[];
}

const TransactionsSummary: React.FC<TransactionsSummaryProps> = ({
    stats,
    transactions
}) => {
    // Calcular total gastado
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.total, 0);

    // Total de videos comprados
    const totalVideos = transactions.reduce(
        (sum, tx) => sum + (tx.records?.length || 0),
        0
    );

    const summaryCards = [
        {
            title: "Total Orders",
            value: stats.total,
            icon: <Package className="w-5 h-5" />,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            title: "Total Videos",
            value: totalVideos,
            icon: <CheckCircle className="w-5 h-5" />,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
        },
        {
            title: "Total Spent",
            value: `${totalSpent.toFixed(4)}`,
            icon: <Wallet className="w-5 h-5" />,
            color: "text-primary",
            bgColor: "bg-primary/10",
            isPrice: true,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryCards.map((card, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    {card.title}
                                </p>
                                <p className="text-2xl font-bold">
                                    {card.isPrice ? card.value : card.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                <span className={card.color}>{card.icon}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default TransactionsSummary;