import { UserRole } from "@/auth/shema";
import { z } from "zod";

export const InvitationStatus = z.enum([
  "PENDING",
  "ACCEPTED",
  "CANCELLED",
  "EXPIRED",
]);

export const adminInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum([UserRole.Enum.ADMIN]).optional(),
});

export const adminInvitationAcceptSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string().optional(),
});

export const adminInvitationSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  email: z.string().email(),
  invitedBy: z.string(),
  role: z.enum([UserRole.Enum.ADMIN]),
  status: InvitationStatus,
  token: z.string(),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().optional(),
  invitedByName: z.string(),
});

export const adminInvitationsResponseSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  items: z.array(adminInvitationSchema),
});

export const adminInviteFilterSchema = z.object({
  status: InvitationStatus.optional(),
  sortBy: z
    .enum([
      "createdAt",
      "updatedAt",
      "email",
      "invitedByName",
      "role",
      "status",
    ])
    .optional(),
  sortDesc: z.boolean().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
});

export type AdminInvite = z.infer<typeof adminInviteSchema>;
export type AdminInviteFilter = z.infer<typeof adminInviteFilterSchema>;
export type AdminInvitationAccept = z.infer<typeof adminInvitationAcceptSchema>;
export type AdminInvitation = z.infer<typeof adminInvitationSchema>;
export type AdminInvitationsResponse = z.infer<
  typeof adminInvitationsResponseSchema
>;
export type InvitationStatusType = z.infer<typeof InvitationStatus>;
