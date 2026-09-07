"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, RotateCcw, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Employee = {
  id: string;
  name: string;
  email: string;
  employeeId: string | null;
  branch: string | null;
  department: string | null;
  position: string;
  status: "PENDING_REVIEW" | "ACTIVE" | "SUSPENDED" | "REJECTED";
};

const AVATAR_COLORS = [
  "bg-amber-100 text-amber-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}
function colorFor(id: string) {
  let sum = 0;
  for (const ch of id) sum += ch.charCodeAt(0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}
function statusVariant(status: Employee["status"]) {
  switch (status) {
    case "ACTIVE": return "active" as const;
    case "PENDING_REVIEW": return "pending" as const;
    case "SUSPENDED": return "suspended" as const;
    case "REJECTED": return "rejected" as const;
  }
}

const PAGE_SIZE = 7;

export function UserDirectoryTable({
  branches,
  departments,
}: {
  branches: { id: string; name: string }[];
  departments: { id: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState<string>("all");
  const [departmentId, setDepartmentId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<{ employees: Employee[]; total: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
    if (search) params.set("search", search);
    if (branchId !== "all") params.set("branchId", branchId);
    if (departmentId !== "all") params.set("departmentId", departmentId);
    if (status !== "all") params.set("status", status);

    fetch(`/api/employees?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [search, branchId, departmentId, status, page]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const rangeStart = data && data.total > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = data ? Math.min(page * PAGE_SIZE, data.total) : 0;

  const pageNumbers = useMemo(() => {
    const pages = new Set<number>([1, totalPages, page]);
    if (page > 1) pages.add(page - 1);
    if (page < totalPages) pages.add(page + 1);
    return Array.from(pages).filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  }, [page, totalPages]);

  function resetFilters() {
    setSearch("");
    setBranchId("all");
    setDepartmentId("all");
    setStatus("all");
    setPage(1);
  }

  function exportCsv() {
    if (!data) return;
    const header = ["Name", "Email", "Employee ID", "Branch", "Department", "Position", "Status"];
    const rows = data.employees.map((e) => [
      e.name, e.email, e.employeeId ?? "", e.branch ?? "", e.department ?? "", e.position, e.status,
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finreal-employees-page-${page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Quickly search by Name, Email, or Employee ID"
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <Select value={branchId} onValueChange={(v) => { setBranchId(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Branch: All Branches" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Branch: All Branches</SelectItem>
            {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={departmentId} onValueChange={(v) => { setDepartmentId(v); setPage(1); }}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Department: All Departments" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Department: All Departments</SelectItem>
            {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status: All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
          <Download className="h-3.5 w-3.5" /> Export CSV / Report
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Employee Name &amp; Corporate Email</th>
              <th className="px-4 py-3 font-medium">Employee ID</th>
              <th className="px-4 py-3 font-medium">Branch &amp; Department</th>
              <th className="px-4 py-3 font-medium">Position / Job Title</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Loading employees...</td></tr>
            )}
            {!loading && data?.employees.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No employees match these filters.</td></tr>
            )}
            {!loading && data?.employees.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className={colorFor(e.id)}>{initials(e.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{e.name}</p>
                      <p className="text-xs text-muted-foreground">{e.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded bg-secondary px-2 py-1 font-mono text-xs">{e.employeeId ?? "\u2014"}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{e.branch ?? "\u2014"}</p>
                  <p className="text-xs text-muted-foreground">{e.department ?? "\u2014"}</p>
                </td>
                <td className="px-4 py-3">{e.position}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                      Edit Details
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            Showing {rangeStart} to {rangeEnd} of {data?.total ?? 0} total employees
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {pageNumbers.map((p, i) => (
              <span key={p} className="flex items-center">
                {i > 0 && pageNumbers[i - 1] !== p - 1 && <span className="px-1">&hellip;</span>}
                <Button
                  variant={p === page ? "default" : "outline"}
                  size="sm"
                  className="w-9"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              </span>
            ))}
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
