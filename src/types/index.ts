import type { Database } from './database.types'

// Generic type helpers
type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

// Tables
export type AdminUser = Tables<"admin_users">
export type AdminUserInsert = TablesInsert<"admin_users">
export type AdminUserUpdate = TablesUpdate<"admin_users">

export type AdminWallet = Tables<"admin_wallets">
export type AdminWalletInsert = TablesInsert<"admin_wallets">
export type AdminWalletUpdate = TablesUpdate<"admin_wallets">

export type BetaAccesRequest = Tables<"beta_access_requests">
export type BetaAccesRequestInsert = TablesInsert<"beta_access_requests">
export type BetaAccesRequestUpdate = TablesUpdate<"beta_access_requests">

export type BlockchainNetwork = Tables<"blockchain_networks">
export type BlockchainNetworkInsert = TablesInsert<"blockchain_networks">
export type BlockchainNetworkUpdate = TablesUpdate<"blockchain_networks">

export type DownloadLog = Tables<"download_logs">
export type DownloadLogInsert = TablesInsert<"download_logs">
export type DownloadLogUpdate = TablesUpdate<"download_logs">

export type NetworkConfig = Tables<"network_config">
export type NetworkConfigInsert = TablesInsert<"network_config">
export type NetworkConfigUpdate = TablesUpdate<"network_config">

export type Nonce = Tables<"nonces">
export type NonceInsert = TablesInsert<"nonces">
export type NonceUpdate = TablesUpdate<"nonces">

export type PaymentLog = Tables<"payment_logs">
export type PaymentLogInsert = TablesInsert<"payment_logs">
export type PaymentLogUpdate = TablesUpdate<"payment_logs">

export type Project = Tables<"projects">
export type ProjectInsert = TablesInsert<"projects">
export type ProjectUpdate = TablesUpdate<"projects">

export type Record = Tables<"records">
export type RecordInsert = TablesInsert<"records">
export type RecordUpdate = TablesUpdate<"records">

export type ReferralCode = Tables<"referral_codes">
export type ReferralCodeInsert = TablesInsert<"referral_codes">
export type ReferralCodeUpdate = TablesUpdate<"referral_codes">

export type Template = Tables<"templates">
export type TemplateInsert = TablesInsert<"templates">
export type TemplateUpdate = TablesUpdate<"templates">

export type TokenPrice = Tables<"token_prices">
export type TokenPriceInsert = TablesInsert<"token_prices">
export type TokenPriceUpdate = TablesUpdate<"token_prices">

export type Transaction = Tables<"transactions">
export type TransactionInsert = TablesInsert<"transactions">
export type TransactionUpdate = TablesUpdate<"transactions">

export type User = Tables<"users">
export type UserInsert = TablesInsert<"users">
export type UserUpdate = TablesUpdate<"users">

export type WebhookConfig = Tables<"webhook_config">
export type WebhookConfigInsert = TablesInsert<"webhook_config">
export type WebhookConfigUpdate = TablesUpdate<"webhook_config">
