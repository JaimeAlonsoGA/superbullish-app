import { RecordStatus, TransactionStatus } from "@/types/definitions";

export const TRANSACTION_STATUS_CONFIG = {
    success: {
        label: 'Successful',
        description: 'Payment confirmed on blockchain',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    failed: {
        label: 'Failed',
        description: 'Transaction failed on blockchain',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
    },
} as const;

export const RECORD_STATUS_CONFIG = {
    processing: {
        label: 'Processing',
        description: 'Video is being rendered',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
    },
    delivered: {
        label: 'Delivered',
        description: 'Video ready to download',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
    },
    failed: {
        label: 'Failed',
        description: 'Rendering failed',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
    },
} as const;

/**
 * Determines the aggregated status based on all records in a transaction.
 * Used for displaying overall order status.
 */
export function getAggregatedRecordStatus(
    records: Array<{ status: RecordStatus }> | undefined | null
): {
    status: RecordStatus;
    description: string;
    canDownload: boolean;
    deliveredCount: number;
    processingCount: number;
    failedCount: number;
    totalCount: number;
} {
    if (!records || records.length === 0) {
        return {
            status: 'processing',
            description: 'Initializing order',
            canDownload: false,
            deliveredCount: 0,
            processingCount: 0,
            failedCount: 0,
            totalCount: 0,
        };
    }

    const deliveredCount = records.filter(r => r.status === 'delivered').length;
    const processingCount = records.filter(r => r.status === 'processing').length;
    const failedCount = records.filter(r => r.status === 'failed').length;
    const totalCount = records.length;

    // All delivered → order complete
    if (deliveredCount === totalCount) {
        return {
            status: 'delivered',
            description: `All ${totalCount} video${totalCount > 1 ? 's' : ''} ready to download`,
            canDownload: true,
            deliveredCount,
            processingCount,
            failedCount,
            totalCount,
        };
    }

    // All failed → order failed
    if (failedCount === totalCount) {
        return {
            status: 'failed',
            description: 'All videos failed to render',
            canDownload: false,
            deliveredCount,
            processingCount,
            failedCount,
            totalCount,
        };
    }

    // Some failed, some delivered → partial failure
    if (failedCount > 0 && deliveredCount > 0) {
        return {
            status: 'failed',
            description: `${failedCount} of ${totalCount} video${failedCount > 1 ? 's' : ''} failed`,
            canDownload: true, // can still download successful ones
            deliveredCount,
            processingCount,
            failedCount,
            totalCount,
        };
    }

    // Some failed, rest processing → still processing with failures
    if (failedCount > 0) {
        return {
            status: 'processing',
            description: `${processingCount} processing, ${failedCount} failed`,
            canDownload: deliveredCount > 0,
            deliveredCount,
            processingCount,
            failedCount,
            totalCount,
        };
    }

    // Some delivered, rest processing → partial delivery
    if (deliveredCount > 0) {
        return {
            status: 'processing',
            description: `${deliveredCount} ready, ${processingCount} still processing`,
            canDownload: true,
            deliveredCount,
            processingCount,
            failedCount,
            totalCount,
        };
    }

    // All processing → default
    return {
        status: 'processing',
        description: `Processing ${totalCount} video${totalCount > 1 ? 's' : ''}`,
        canDownload: false,
        deliveredCount,
        processingCount,
        failedCount,
        totalCount,
    };
}