export type OAuthStartRequest = {
  provider: 'OPEN_BANKING_KR';
};

export type OAuthStartResponseData = {
  auth_url: string;
  state_token: string;
};

export type OAuthCallbackRequest = {
  code: string;
  state_token: string;
};

export type LinkedAccount = {
  account_id: string;
  bank_name: string;
  masked_number: string;
};

export type OAuthCallbackResponseData = {
  linked_accounts: LinkedAccount[];
};

export type SyncRequest = {
  from_date: string;
  to_date: string;
};

export type SyncResponseData = {
  synced_count: number;
  new_count: number;
  sync_id: string;
};
