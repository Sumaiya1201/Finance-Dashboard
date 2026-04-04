"use client";

import { useFinance } from "@/context/FinanceContext";
import { useMemo } from "react";

const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
];

export function SpendingChart() {
  const { transactions } = useFinance();

  const categoryData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const categoryTotals: Record<string, number> = {};

    expenses.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

    return Object.entries(categoryTotals)
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [transactions]);

  const totalExpenses = categoryData.reduce((sum, d) => sum + d.amount, 0);

  // Generate SVG donut chart
  const generateDonutPath = () => {
    if (categoryData.length === 0) return null;
    
    let cumulativePercent = 0;
    const paths: JSX.Element[] = [];
    
    categoryData.forEach((item, index) => {
      const percent = item.percentage;
      const startAngle = cumulativePercent * 3.6; // Convert to degrees
      const endAngle = (cumulativePercent + percent) * 3.6;
      
      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = 90 + 70 * Math.cos(startRad);
      const y1 = 90 + 70 * Math.sin(startRad);
      const x2 = 90 + 70 * Math.cos(endRad);
      const y2 = 90 + 70 * Math.sin(endRad);
      
      const largeArcFlag = percent > 50 ? 1 : 0;
      
      const pathData = `
        M 90 90
        L ${x1} ${y1}
        A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;
      
      paths.push(
        <path
          key={index}
          d={pathData}
          fill={item.color}
          stroke="var(--finance-card)"
          strokeWidth="2"
        />
      );
      
      cumulativePercent += percent;
    });
    
    return paths;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (categoryData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Spending by Category</h3>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h4 className="empty-state-title">No expense data</h4>
          <p className="empty-state-text">Add some transactions to see your spending breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Spending by Category</h3>
      </div>
      <div className="chart-container">
        <div className="donut-chart">
          <div className="donut-visual">
            <svg viewBox="0 0 180 180" width="180" height="180">
              {generateDonutPath()}
              <circle cx="90" cy="90" r="45" fill="var(--finance-card)" />
            </svg>
            <div className="donut-center">
              <div className="donut-center-value">{formatCurrency(totalExpenses)}</div>
              <div className="donut-center-label">Total Spent</div>
            </div>
          </div>
          <div className="donut-legend">
            {categoryData.map((item, index) => (
              <div key={index} className="donut-legend-item">
                <div
                  className="donut-legend-color"
                  style={{ backgroundColor: item.color }}
                />
                <span className="donut-legend-text">{item.category}</span>
                <span className="donut-legend-value">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
