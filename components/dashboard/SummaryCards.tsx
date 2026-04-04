"use client";

import { useFinance } from "@/context/FinanceContext";
import { useMemo } from "react";

export function SummaryCards() {
  const { transactions } = useFinance();

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;

    // Calculate month-over-month change
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const lastMonthTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
    });

    const currentMonthExpenses = currentMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastMonthExpenses = lastMonthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenseChange = lastMonthExpenses > 0 
      ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 
      : 0;

    return {
      balance,
      totalIncome,
      totalExpenses,
      expenseChange,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div className="summary-card-header">
          <h3 className="summary-card-title">Total Balance</h3>
          <div className="summary-card-icon balance">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M12 8v8"/>
              <path d="M8 12h8"/>
            </svg>
          </div>
        </div>
        <p className={`summary-card-value ${stats.balance >= 0 ? "positive" : "negative"}`}>
          {formatCurrency(stats.balance)}
        </p>
        <div className="summary-card-change positive">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5"/>
            <path d="M5 12l7-7 7 7"/>
          </svg>
          <span>Net worth</span>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <h3 className="summary-card-title">Total Income</h3>
          <div className="summary-card-icon income">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v20"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
        </div>
        <p className="summary-card-value positive">{formatCurrency(stats.totalIncome)}</p>
        <div className="summary-card-change positive">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5"/>
            <path d="M5 12l7-7 7 7"/>
          </svg>
          <span>All time earnings</span>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-card-header">
          <h3 className="summary-card-title">Total Expenses</h3>
          <div className="summary-card-icon expense">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18"/>
              <path d="M18 17V9"/>
              <path d="M13 17V5"/>
              <path d="M8 17v-3"/>
            </svg>
          </div>
        </div>
        <p className="summary-card-value negative">{formatCurrency(stats.totalExpenses)}</p>
        <div className={`summary-card-change ${stats.expenseChange >= 0 ? "negative" : "positive"}`}>
          {stats.expenseChange >= 0 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14"/>
              <path d="M19 12l-7 7-7-7"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5"/>
              <path d="M5 12l7-7 7 7"/>
            </svg>
          )}
          <span>{Math.abs(stats.expenseChange).toFixed(1)}% vs last month</span>
        </div>
      </div>
    </div>
  );
}
