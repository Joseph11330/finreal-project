import { z } from "zod";

export const createAnnouncementSchema = z.object({
  subject: z.string().min(1, "Subject is required.").max(160, "Keep the subject under 160 characters."),
  body: z.string().min(1, "Write an update to share."),
  attachmentName: z.string().optional(),
  attachmentSizeLabel: z.string().optional(),
  allowReactions: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  // When present, an EVENT-type CalendarEntry is created and linked to this
  // announcement (the "Add Event" toggle in the composer).
  event: z
    .object({
      title: z.string().min(1, "Event title is required."),
      date: z.string().min(1, "Event date is required."),
      time: z.string().optional(),
      location: z.string().optional(),
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
