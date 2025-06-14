import { useAlert } from "@/providers/alert-provider";
import { useAuthContext } from "@/providers/auth-context";
import { apiPost } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AdminInvite,
  AdminInvitation,
  AdminInvitationAccept,
  adminInvitationSchema,
} from "../schema";
import { adminInviteKeys } from "../utils";
import { API_URL, getErrorField } from "@/lib/utils";
import { User, UserSchema } from "@/auth/shema";
import humps from "humps";

export function useAdminInviteActions() {
  const baseUrl = `${API_URL}/api/v1/admin-invites`;
  const { token } = useAuthContext();
  const alert = useAlert();
  const queryClient = useQueryClient();

  const createInvite = async ({
    inviteData,
  }: {
    inviteData: AdminInvite;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<AdminInvitation>(
      `${baseUrl}/invite`,
      adminInvitationSchema,
      humps.decamelizeKeys(inviteData),
      token ?? undefined
    );
  };

  const cancelInvite = async ({
    invitationId,
  }: {
    invitationId: string;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<AdminInvitation>(
      `${baseUrl}/${invitationId}/cancel`,
      adminInvitationSchema,
      {},
      token ?? undefined
    );
  };

  const acceptInvitation = async ({
    acceptData,
  }: {
    acceptData: AdminInvitationAccept;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<User>(
      `${baseUrl}/accept`,
      UserSchema,
      humps.decamelizeKeys(acceptData)
    );
  };

  const resendInvite = async ({
    invitationId,
  }: {
    invitationId: string;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return apiPost<AdminInvitation>(
      `${baseUrl}/${invitationId}/resend`,
      adminInvitationSchema,
      {},
      token ?? undefined
    );
  };

  const createInviteMutation = useMutation({
    mutationFn: createInvite,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: adminInviteKeys.lists(),
      });
      alert?.success("Admin invitation sent successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error(getErrorField(error, "detail") || "Failed to send admin invitation");
    },
  });

  const cancelInviteMutation = useMutation({
    mutationFn: cancelInvite,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: adminInviteKeys.lists(),
      });
      alert?.success("Invitation cancelled successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error(getErrorField(error, "detail") || "Failed to cancel invitation");
    },
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      alert?.success("Invitation accepted successfully! You can now login.");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error(getErrorField(error, "detail") || "Failed to accept invitation");
    },
  });

  const resendInviteMutation = useMutation({
    mutationFn: resendInvite,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();
      queryClient.invalidateQueries({
        queryKey: adminInviteKeys.lists(),
      });
      alert?.success("Invitation resent successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error(getErrorField(error, "detail") || "Failed to resend invitation");
    },
  });

  return {
    createInvite: createInviteMutation.mutate,
    cancelInvite: cancelInviteMutation.mutate,
    acceptInvitation: acceptInvitationMutation.mutate,
    resendInvite: resendInviteMutation.mutate,
    isCreating: createInviteMutation.isPending,
    isCanceling: cancelInviteMutation.isPending,
    isAccepting: acceptInvitationMutation.isPending,
    isResending: resendInviteMutation.isPending,
  };
}
