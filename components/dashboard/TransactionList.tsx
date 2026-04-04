"use client";

import { useFinance, type Transaction } from "@/context/FinanceContext";
import { useMemo, useState } from "react";
import { TransactionModal } from "./TransactionModal";

export function TransactionList() {
  const {
    transactions,
    role,
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
  } = useFinance();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const categories = useMemo(() => {
    const cats = [...new Set(transactions.map((t) => t.category))];
    return cats.sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply category filter
    if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory);
    }

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, filterCategory, filterType, searchQuery, sortBy, sortOrder]);

  const handleSort = (column: "date" | "amount") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getSortClass = (column: "date" | "amount") => {
    if (sortBy !== column) return "sortable";
    return sortOrder === "asc" ? "sorted-asc" : "sorted-desc";
  };

  return (
    <div className="transactions-section">
      <div className="transactions-header">
        <h3 className="transactions-title">Transactions</h3>
        <div className="transactions-controls">
          <input
            type="text"
            placeholder="Search transactions..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {role === "admin" && (
            <button className="btn btn-primary" onClick={handleAddNew}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h4 className="empty-state-title">No transactions found</h4>
          <p className="empty-state-text">
            {searchQuery || filterCategory !== "all" || filterType !== "all"
              ? "Try adjusting your filters"
              : "Add your first transaction to get started"}
          </p>
        </div>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th
                className={getSortClass("date")}
                onClick={() => handleSort("date")}
              >
                Date
              </th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th
                className={getSortClass("amount")}
                onClick={() => handleSort("amount")}
              >
                Amount
              </th>
              {role === "admin" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="transaction-date">
                  {formatDate(transaction.date)}
                </td>
                <td>{transaction.description}</td>
                <td>
                  <span className="transaction-category">
                    {transaction.category}
                  </span>
                </td>
                <td>
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type === "income" ? "↑" : "↓"} {transaction.type}
                  </span>
                </td>
                <td className={`transaction-amount ${transaction.type}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </td>
                {role === "admin" && (
                  <td>
                    <div className="transaction-actions">
                      <button
                        className="btn-icon"
                        onClick={() => handleEdit(transaction)}
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(transaction.id)}
                        title="Delete"
                        style={{ color: "var(--finance-expense)" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => {
            setModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
}
