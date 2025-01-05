import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  username: yup.string().required("Username is required").min(3, "Username must be at least 3 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must include an uppercase letter")
    .matches(/[a-z]/, "Password must include a lowercase letter")
    .matches(/[0-9]/, "Password must include a number"),
});

export const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});
