import { API_URL } from "@/lib/utils";
import { User, UserSchema, UserRoleUpdate } from "../shema";
import { useAuthContext } from "@/providers/auth-context";
import { apiPost } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "@/providers/alert-provider";
import { adminUsersKey } from "../utils";

export function useAdminUserActions() {
  const baseUrl = `${API_URL}/api/v1/users`;
  const queryClient = useQueryClient();
  const { token } = useAuthContext();
  const alert = useAlert();

  const updateUserRole = async ({
    userId,
    roleData,
  }: {
    userId: string;
    roleData: UserRoleUpdate;
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    return await apiPost<User>(
      `${baseUrl}/admin/${userId}/role`,
      UserSchema,
      roleData,
      token ?? undefined
    );
  };

  const updateUserRoleQuery = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data, variables) => {
      const { onSuccess } = variables;
      onSuccess?.();

      queryClient.invalidateQueries({
        queryKey: adminUsersKey.lists(),
      });

      alert?.success("User role updated successfully");
    },
    onError: (error, variables) => {
      const { onError } = variables;
      onError?.();
      alert?.error("Failed to update user role");
    },
  });

  return {
    updateUserRole: updateUserRoleQuery.mutate,
    isUpdating: updateUserRoleQuery.isPending,
    isUpdatingError: updateUserRoleQuery.error,
  };
}
