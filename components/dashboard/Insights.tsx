"use client";

import { useFinance } from "@/context/FinanceContext";
import { useMemo } from "react";

export function Insights() {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const income = transactions.filter((t) => t.type === "income");

    // Highest spending category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const sortedCategories = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    );
    const highestCategory = sortedCategories[0];

    // Monthly comparison
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const getMonthExpenses = (month: number, year: number) => {
      return transactions
        .filter((t) => {
          const date = new Date(t.date);
          return (
            t.type === "expense" &&
            date.getMonth() === month &&
            date.getFullYear() === year
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);
    };

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = getMonthExpenses(currentMonth, currentYear);
    const lastMonthExpenses = getMonthExpenses(lastMonth, lastMonthYear);

    const monthlyChange =
      lastMonthExpenses > 0
        ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
        : 0;

    // Average transaction
    const avgExpense =
      expenses.length > 0
        ? expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length
        : 0;

    // Savings rate
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      highestCategory: highestCategory
        ? { name: highestCategory[0], amount: highestCategory[1] }
        : null,
      monthlyChange,
      currentMonthExpenses,
      lastMonthExpenses,
      avgExpense,
      savingsRate,
      transactionCount: transactions.length,
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

  if (transactions.length === 0) {
    return (
      <div className="insights-section">
        <h3 className="insights-title">Financial Insights</h3>
        <div className="empty-state">
          <div className="empty-state-icon">💡</div>
          <h4 className="empty-state-title">No insights yet</h4>
          <p className="empty-state-text">
            Add some transactions to see your financial insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-section">
      <h3 className="insights-title">Financial Insights</h3>
      <div className="insights-grid">
        {insights.highestCategory && (
          <div className="insight-card">
            <div className="insight-header">
              <div className="insight-icon warning">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18"/>
                  <path d="M18 17V9"/>
                  <path d="M13 17V5"/>
                  <path d="M8 17v-3"/>
                </svg>
              </div>
              <span className="insight-label">Highest Spending</span>
            </div>
            <p className="insight-value">{insights.highestCategory.name}</p>
            <p className="insight-description">
              {formatCurrency(insights.highestCategory.amount)} total spent in this category
            </p>
          </div>
        )}

        <div className="insight-card">
          <div className="insight-header">
            <div className={`insight-icon ${insights.monthlyChange <= 0 ? "success" : "warning"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20V10"/>
                <path d="M18 20V4"/>
                <path d="M6 20v-4"/>
              </svg>
            </div>
            <span className="insight-label">Monthly Comparison</span>
          </div>
          <p className="insight-value">
            {insights.monthlyChange > 0 ? "+" : ""}
            {insights.monthlyChange.toFixed(1)}%
          </p>
          <p className="insight-description">
            {insights.monthlyChange > 0
              ? "Spending increased compared to last month"
              : insights.monthlyChange < 0
              ? "Great! Spending decreased compared to last month"
              : "Spending is the same as last month"}
          </p>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <div className={`insight-icon ${insights.savingsRate >= 20 ? "success" : "info"}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <span className="insight-label">Savings Rate</span>
          </div>
          <p className="insight-value">{insights.savingsRate.toFixed(1)}%</p>
          <p className="insight-description">
            {insights.savingsRate >= 20
              ? "Excellent! You are saving well"
              : insights.savingsRate >= 10
              ? "Good progress, keep saving!"
              : "Consider reducing expenses to save more"}
          </p>
        </div>

        <div className="insight-card">
          <div className="insight-header">
            <div className="insight-icon info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span className="insight-label">Average Expense</span>
          </div>
          <p className="insight-value">{formatCurrency(insights.avgExpense)}</p>
          <p className="insight-description">
            Based on {insights.transactionCount} total transactions
          </p>
        </div>
      </div>
    </div>
  );
}
