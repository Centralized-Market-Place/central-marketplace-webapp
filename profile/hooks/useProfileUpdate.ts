import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/providers/auth-context";
import { useAlert } from "@/providers/alert-provider";
import { User, UserSchema } from "@/auth/shema";
import { AxiosError } from "axios";
import { userQueryKeys } from "../utils";
import { UpdateUserInfo } from "../schemas";
import { apiPatch } from "@/services/api";
import { API_URL } from "@/lib/utils";
import humps from "humps";

export function useProfileUpdate() {
  const { token } = useAuthContext();
  const alert = useAlert();
  const baseUrl = `${API_URL}/api/v1/users/profile`;
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: ({
      data,
    }: {
      data: UpdateUserInfo;
      onSuccess?: (data: User) => void;
      onError?: (error: Error) => void;
    }) =>
      apiPatch<User>(
        baseUrl,
        UserSchema,
        humps.decamelizeKeys(data),
        token ?? undefined
      ),
    onSuccess: (data, variables) => {
      alert?.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: userQueryKeys.details() });
      variables.onSuccess?.(data.data);
    },
    onError: (error: Error, variables) => {
      if (error instanceof AxiosError) {
        const errorMsg = error.response?.data as { detail?: string };
        alert?.error(errorMsg.detail ?? "Failed to update profile");
      } else {
        alert?.error("Failed to update profile");
      }
      variables.onError?.(error);
    },
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    isLoading: updateProfileMutation.isPending,
    isError: updateProfileMutation.isError,
    error: updateProfileMutation.error,
  };
}
