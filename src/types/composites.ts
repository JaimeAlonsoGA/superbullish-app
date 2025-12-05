import { Project, User, Template, Record, Transaction } from ".";

export interface UserWithProjectsAndTransactions extends User {
    projects: Project[] | null;
    transactions: TransactionsData[] | null;
}

export interface TransactionsData extends Transaction {
    record: RecordWithTemplate;
}

export interface RecordWithTemplate extends Record {
    template: Template;
}

export interface TemplateWithProject extends Template {
    project: Project
    dualProject: Project | null;
}

export interface CartItem {
    id: string;
    template: Template;
    project: Project;
    backgroundColor: string;
    headline: string | null;
    subheadline: string | null;
}