"use client";

import { FinanceProvider } from "@/context/FinanceContext";
import { SummaryCards } from "./SummaryCards";
import { BalanceChart } from "./BalanceChart";
import { SpendingChart } from "./SpendingChart";
import { TransactionList } from "./TransactionList";
import { Insights } from "./Insights";
import { RoleSwitcher } from "./RoleSwitcher";
import "@/styles/dashboard.css";

export function Dashboard() {
  return (
    <FinanceProvider>
      <div className="dashboard">
        <div className="dashboard-container">
          <header className="dashboard-header">
            <h1 className="dashboard-title">Finance Dashboard</h1>
            <div className="header-controls">
              <RoleSwitcher />
            </div>
          </header>

          <SummaryCards />

          <div className="charts-grid">
            <BalanceChart />
            <SpendingChart />
          </div>

          <TransactionList />

          <Insights />
        </div>
      </div>
    </FinanceProvider>
  );
}
