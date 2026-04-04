"use client";

import { useFinance } from "@/context/FinanceContext";
import { useMemo } from "react";

export function BalanceChart() {
  const { transactions } = useFinance();

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const currentYear = 2024;
    
    return months.map((month, index) => {
      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      });

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return { month, income, expenses };
    });
  }, [transactions]);

  const maxValue = useMemo(() => {
    const allValues = monthlyData.flatMap((d) => [d.income, d.expenses]);
    return Math.max(...allValues, 1000);
  }, [monthlyData]);

  const getBarHeight = (value: number) => {
    return (value / maxValue) * 180;
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Monthly Overview</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: "var(--finance-income)" }}></span>
            <span>Income</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: "var(--finance-expense)" }}></span>
            <span>Expenses</span>
          </div>
        </div>
      </div>
      <div className="chart-container">
        <div className="bar-chart">
          {monthlyData.map((data, index) => (
            <div key={index} className="bar-group">
              <div className="bar-wrapper">
                <div
                  className="bar income"
                  style={{ height: `${getBarHeight(data.income)}px` }}
                  title={`Income: $${data.income.toLocaleString()}`}
                />
                <div
                  className="bar expense"
                  style={{ height: `${getBarHeight(data.expenses)}px` }}
                  title={`Expenses: $${data.expenses.toLocaleString()}`}
                />
              </div>
              <span className="bar-label">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
