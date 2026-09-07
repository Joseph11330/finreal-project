"use client";

import { useEffect, useState } from "react";
import { Printer, Download, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ApplicationDetail = {
  id: string;
  documentId: string;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  submissionDate: string;
  appealType: string | null;
  dateOfIncident: string | null;
  expectedArrivalTime: string | null;
  actualArrivalTime: string | null;
  totalDelayMinutes: number | null;
  employee: { name: string; employeeId: string | null; department: string | null; branch: string | null };
};

function formatDate(iso: string | null) {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function ApplicationReviewModal({
  applicationId,
  open,
  onOpenChange,
  onDecided,
}: {
  applicationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDecided?: () => void;
}) {
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !applicationId) return;
    setLoading(true);
    setShowRejectForm(false);
    setReason("");
    setReasonError(null);
    fetch(`/api/applications/${applicationId}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [open, applicationId]);

  async function handleApprove() {
    if (!applicationId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/approve`, { method: "POST" });
      if (res.ok) {
        onOpenChange(false);
        onDecided?.();
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReject() {
    if (!applicationId) return;
    if (reason.trim().length < 10) {
      setReasonError("Please provide at least 10 characters explaining the rejection.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        onOpenChange(false);
        onDecided?.();
      } else {
        const json = await res.json();
        setReasonError(json.error ?? "Failed to reject application.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0" hideClose>
        <DialogHeader>
          <div>
            <div className="flex items-center gap-2">
              <DialogTitle>Application Document Review</DialogTitle>
              {data && (
                <Badge variant={data.status === "PENDING_REVIEW" ? "pending" : data.status === "APPROVED" ? "approved" : "rejected"}>
                  {data.status.replace("_", " ")}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Late Arrival Appeal &bull; {data?.documentId ?? "\u2026"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto bg-secondary/40 p-6">
          {loading || !data ? (
            <p className="py-16 text-center text-sm text-muted-foreground">Loading document...</p>
          ) : (
            <div className="relative overflow-hidden rounded-md border bg-card p-8 shadow-sm">
              <div className="absolute right-0 top-0 h-0 w-0 border-b-[70px] border-l-[70px] border-b-transparent border-l-primary" />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xl font-black tracking-tight">STITCH FINREAL</p>
                  <p className="text-xs tracking-widest text-muted-foreground">PEOPLE &bull; PROCESS &bull; PROGRESS</p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Human Resources Department</p>
                  <p>123 Corporate Center, Makati City</p>
                  <p>Philippines 1200</p>
                </div>
              </div>

              <div className="mt-6 flex items-start justify-between border-t pt-6">
                <div className="max-w-md">
                  <h2 className="text-2xl font-black uppercase">Late Arrival Appeal Report</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    This document serves as a formal request for the consideration of a late
                    arrival appeal, in accordance with company policies and procedures.
                  </p>
                </div>
                <div className="w-56 shrink-0 space-y-2 rounded-md border bg-secondary/50 p-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Document ID</span><span className="font-mono font-semibold">{data.documentId}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Submission Date</span><span className="font-semibold">{formatDate(data.submissionDate)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="font-semibold text-primary">{data.status.replace("_", " ")}</span></div>
                </div>
              </div>

              <section className="mt-6 border-t pt-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <span className="h-4 w-1 rounded bg-primary" /> 1: REQUEST INFORMATION
                </p>
                <div className="grid grid-cols-2 gap-4 rounded-md bg-secondary/50 p-4 text-sm">
                  <div><p className="text-xs uppercase text-muted-foreground">Request Type</p><p className="font-semibold">Late Arrival Appeal</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Submission Date</p><p className="font-semibold">{formatDate(data.submissionDate)}</p></div>
                </div>
              </section>

              <section className="mt-6 border-t pt-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <span className="h-4 w-1 rounded bg-primary" /> 2. EMPLOYEE DETAILS
                </p>
                <div className="grid grid-cols-4 gap-4 rounded-md bg-secondary/50 p-4 text-sm">
                  <div><p className="text-xs uppercase text-muted-foreground">Employee Name</p><p className="font-semibold">{data.employee.name}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Employee ID</p><p className="font-semibold">{data.employee.employeeId ?? "\u2014"}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Department</p><p className="font-semibold">{data.employee.department ?? "\u2014"}</p></div>
                  <div><p className="text-xs uppercase text-muted-foreground">Branch</p><p className="font-semibold">{data.employee.branch ?? "\u2014"}</p></div>
                </div>
              </section>

              <section className="mt-6 border-t pt-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold">
                  <span className="h-4 w-1 rounded bg-primary" /> 3. INCIDENT SUMMARY
                </p>
                <div className="flex items-start justify-between gap-4 rounded-md bg-secondary/50 p-4 text-sm">
                  <div className="grid grid-cols-3 gap-6">
                    <div><p className="text-xs uppercase text-muted-foreground">Appeal Type</p><p className="font-semibold">{data.appealType ?? "\u2014"}</p></div>
                    <div><p className="text-xs uppercase text-muted-foreground">Expected Arrival Time</p><p className="font-mono font-semibold">{data.expectedArrivalTime ?? "\u2014"}</p></div>
                    <div><p className="text-xs uppercase text-muted-foreground">Actual Arrival Time</p><p className="font-mono font-semibold">{data.actualArrivalTime ?? "\u2014"}</p></div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs uppercase text-primary">Total Delay</p>
                    <p className="text-3xl font-black text-primary">
                      {data.totalDelayMinutes ?? "\u2014"} <span className="text-sm font-medium">minutes</span>
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Date of Incident: <span className="font-semibold text-foreground">{formatDate(data.dateOfIncident)}</span>
                </p>
              </section>
            </div>
          )}

          {showRejectForm && (
            <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-4">
              <label className="text-sm font-semibold text-destructive">Reason for rejection (required)</label>
              <Textarea
                className="mt-2"
                placeholder="Explain why this appeal is being rejected. This is recorded in the audit trail and may be shared with the employee."
                value={reason}
                onChange={(e) => { setReason(e.target.value); setReasonError(null); }}
                error={!!reasonError}
              />
              {reasonError && <p className="mt-1 text-xs text-destructive">{reasonError}</p>}
            </div>
          )}
        </div>

        <DialogFooter>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Action will be recorded under Supervisor audit trail
            {data && <span className="font-medium text-foreground">({data.employee.name} &bull; {data.employee.employeeId})</span>}
          </p>

          {data?.status === "PENDING_REVIEW" ? (
            showRejectForm ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowRejectForm(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  className="bg-destructive text-destructive-foreground hover:opacity-90"
                  onClick={handleReject}
                  loading={submitting}
                >
                  Confirm Rejection
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => setShowRejectForm(true)}
                >
                  Reject Application
                </Button>
                <Button onClick={handleApprove} loading={submitting}>
                  Approve Application
                </Button>
              </div>
            )
          ) : (
            <p className="text-sm font-medium text-muted-foreground">
              This application has already been {data?.status.toLowerCase()}.
            </p>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
