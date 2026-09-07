"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApplicationReviewModal } from "@/components/documents/application-review-modal";

type Row = {
  id: string;
  documentId: string;
  type: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  submissionDate: string;
  employeeName: string;
  department: string | null;
};

function typeLabel(type: string) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function FormsQueue() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/applications")
      .then((res) => res.json())
      .then((json) => setRows(json.applications ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-secondary text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Document ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Loading forms...</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">No submitted forms yet.</td></tr>
            )}
            {!loading && rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-mono text-xs">{r.documentId}</td>
                <td className="px-4 py-3">{typeLabel(r.type)}</td>
                <td className="px-4 py-3 font-medium">{r.employeeName}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.department ?? "\u2014"}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(r.submissionDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={r.status === "PENDING_REVIEW" ? "pending" : r.status === "APPROVED" ? "approved" : "rejected"}>
                    {r.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setActiveId(r.id); setOpen(true); }}
                  >
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ApplicationReviewModal
        applicationId={activeId}
        open={open}
        onOpenChange={setOpen}
        onDecided={load}
      />
    </div>
  );
}
