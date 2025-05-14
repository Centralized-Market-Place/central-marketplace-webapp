import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInfo } from "../services/profile-api";
import { useAuthContext } from "@/providers/auth-context";
import { useAlert } from "@/providers/alert-provider";
import { User } from "@/auth/shema";

export function useProfileUpdate() {
  const { token } = useAuthContext();
  const alert = useAlert();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => updateUserInfo(data, token!),
    onSuccess: () => {
      alert?.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      console.error("Profile update error:", error.response?.data);
      alert?.error(error.message || "Failed to update profile");
    },
  });
} 