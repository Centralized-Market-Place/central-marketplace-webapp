import { apiPatch } from "@/services/api";
import { User, UserSchema } from "@/auth/shema";
import { API_URL } from "@/lib/utils";


// profile/services/profile-api.ts
export const updateUserInfo = async (data: Partial<User>, token: string) => {
  // Get the current user data from the auth context
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // Take the partial update data and fill in the rest from current user
  const payload = {
    ...currentUser,  // Start with all current user data
    ...data,         // Override with any fields from the partial update
    _id: currentUser._id || currentUser.id,  // Ensure these required fields
    password_hash: currentUser.password_hash || currentUser.passwordHash,
    email: currentUser.email,
  };

  console.log("Sending payload:", payload); // For debugging

  return apiPatch<User>(
    `${API_URL}/api/v1/users/profile/update-user-info`,
    UserSchema,
    payload,
    token
  );
};