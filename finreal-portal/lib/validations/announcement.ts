import { z } from "zod";

export const createAnnouncementSchema = z.object({
  subject: z.string().min(1, "Subject is required.").max(160, "Keep the subject under 160 characters."),
  body: z.string().min(1, "Write an update to share."),
  // Backwards compat single attachment fields
  attachmentName: z.string().optional(),
  attachmentSizeLabel: z.string().optional(),
  // New unified multi-attachment shape
  attachments: z
    .array(z.object({ name: z.string(), sizeLabel: z.string() }))
    .max(5)
    .optional(),
  allowReactions: z.boolean().default(true).optional(),
  allowComments: z.boolean().default(true).optional(),
  // Event linked to announcement — supports both legacy single-date and new range shape
  event: z
    .object({
      title: z.string().min(1, "Event title is required."),
      // legacy
      date: z.string().optional(),
      time: z.string().optional(),
      // new range shape
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      location: z.string().optional(),
    })
    .refine(
      (v) => Boolean(v.date || v.startDate),
      { message: "Event date is required.", path: ["startDate"] }
    )
    .optional(),
  // Poll shape (new)
  poll: z
    .object({
      question: z.string().min(1, "Poll question is required."),
      options: z.array(z.string().min(1)).min(2).max(6),
    })
    .optional(),
});
export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;

export const updateAnnouncementSchema = z.object({
  subject: z.string().min(1).max(160).optional(),
  body: z.string().min(1).optional(),
  pinned: z.boolean().optional(),
});
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
