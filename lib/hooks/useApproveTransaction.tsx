"use client";
import { useMutation, UseMutateAsyncFunction } from "@tanstack/react-query";
import { approveTransaction } from "../actions";

export const useApproveTransaction = () => {
  return useMutation({
    mutationFn: (id: string) => approveTransaction(id),
    onMutate: (id: string) => {
      console.log("Mutating with ID:", id);
      return { id: 1 }; // This is an optimistic update; adjust as needed
    },
    onSuccess: (data) => {
      console.log("Transaction approved:", data);
    },
    onError: (error) => {
      console.error("Error approving transaction:", error);
    }
  });
};