"use client";

import { useFinance, type UserRole } from "@/context/FinanceContext";

export function RoleSwitcher() {
  const { role, setRole } = useFinance();

  return (
    <div className="role-switcher">
      <span className="role-label">Role:</span>
      <select
        className="role-select"
        value={role}
        onChange={(e) => setRole(e.target.value as UserRole)}
      >
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
      <span className={`role-badge ${role}`}>{role}</span>
    </div>
  );
}
