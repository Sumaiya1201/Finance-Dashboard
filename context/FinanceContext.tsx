"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type TransactionType = "income" | "expense";
export type UserRole = "viewer" | "admin";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

interface FinanceContextType {
  transactions: Transaction[];
  role: UserRole;
  setRole: (role: UserRole) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "date" | "amount";
  setSortBy: (sort: "date" | "amount") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

const initialTransactions: Transaction[] = [
  { id: "1", date: "2024-03-01", amount: 5000, category: "Salary", type: "income", description: "Monthly salary" },
  { id: "2", date: "2024-03-02", amount: 150, category: "Groceries", type: "expense", description: "Weekly groceries" },
  { id: "3", date: "2024-03-05", amount: 80, category: "Utilities", type: "expense", description: "Electric bill" },
  { id: "4", date: "2024-03-08", amount: 200, category: "Dining", type: "expense", description: "Restaurant dinner" },
  { id: "5", date: "2024-03-10", amount: 500, category: "Freelance", type: "income", description: "Freelance project" },
  { id: "6", date: "2024-03-12", amount: 120, category: "Entertainment", type: "expense", description: "Concert tickets" },
  { id: "7", date: "2024-03-15", amount: 1200, category: "Rent", type: "expense", description: "Monthly rent" },
  { id: "8", date: "2024-03-18", amount: 60, category: "Transport", type: "expense", description: "Gas" },
  { id: "9", date: "2024-03-20", amount: 250, category: "Shopping", type: "expense", description: "New clothes" },
  { id: "10", date: "2024-03-22", amount: 300, category: "Investment", type: "income", description: "Dividend payment" },
  { id: "11", date: "2024-03-25", amount: 45, category: "Groceries", type: "expense", description: "Snacks and drinks" },
  { id: "12", date: "2024-03-28", amount: 100, category: "Healthcare", type: "expense", description: "Doctor visit" },
  { id: "13", date: "2024-02-01", amount: 5000, category: "Salary", type: "income", description: "February salary" },
  { id: "14", date: "2024-02-10", amount: 180, category: "Groceries", type: "expense", description: "Groceries" },
  { id: "15", date: "2024-02-15", amount: 1200, category: "Rent", type: "expense", description: "February rent" },
  { id: "16", date: "2024-01-01", amount: 5000, category: "Salary", type: "income", description: "January salary" },
  { id: "17", date: "2024-01-15", amount: 1200, category: "Rent", type: "expense", description: "January rent" },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [role, setRole] = useState<UserRole>("admin");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const addTransaction = useCallback((transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  }, []);

  const updateTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        role,
        setRole,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        filterCategory,
        setFilterCategory,
        filterType,
        setFilterType,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
}
