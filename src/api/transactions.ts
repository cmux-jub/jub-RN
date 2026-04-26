import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse, Category } from '@/api/types/common';
import type { TransactionDetail, TransactionListResponseData, TransactionSatisfactionInput, TransactionSatisfactionResponseData } from '@/api/types/transactions';

export async function fetchTransactions(params?: {
  from_date?: string;
  to_date?: string;
  category?: Category;
  cursor?: string;
  limit?: number;
}) {
  const { data } = await apiClient.get<ApiResponse<TransactionListResponseData>>(endpoints.transactions.list, {
    params,
  });
  return data;
}

export async function fetchTransactionDetail(transactionId: string) {
  const { data } = await apiClient.get<ApiResponse<TransactionDetail>>(`${endpoints.transactions.list}/${transactionId}`);
  return data;
}

export async function updateTransactionCategory(transactionId: string, category: Category) {
  const { data } = await apiClient.patch<ApiResponse<TransactionDetail>>(
    `${endpoints.transactions.list}/${transactionId}/category`,
    { category },
  );
  return data;
}

export async function submitTransactionSatisfaction(transactionId: string, payload: TransactionSatisfactionInput) {
  const { data } = await apiClient.post<ApiResponse<TransactionSatisfactionResponseData>>(
    `${endpoints.transactions.list}/${transactionId}/satisfaction`,
    payload,
  );
  return data;
}
