import { Project, User, Template, Record, Transaction, BlockchainNetwork } from ".";
import { RecordStatus, TransactionStatus } from "./definitions";

export interface UserWithProjectsAndTransactions extends User {
    projects: Project[] | null;
    transactions: TransactionsData[] | null;
}

export interface TransactionsData extends Transaction {
    records: RecordWithTemplate[];
    blockchainNetwork: BlockchainNetwork;
    status: TransactionStatus;
}

export interface RecordWithTemplate extends Record {
    template: Template;
    project: Project;
    status: RecordStatus;
}

export interface CartItem {
    id: string;
    template: Template;
    project: Project;
    backgroundColor: string;
    headline: string | null;
    subheadline: string | null;
}