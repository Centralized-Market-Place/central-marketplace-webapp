import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../../components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { UserRegister, UserRegisterSchema } from "../shema";
import { Button } from "../../components/ui/button";
import LoadingIcon from "@/components/state/loading";
import { PasswordInput } from "@/components/common/password-input";

export default function SignUpForm({
  onSave,
  isLoading = false,
  error = false,
}: {
  onSave: (data: UserRegister) => void;
  isLoading?: boolean;
  error?: boolean;
}) {
  const form = useForm<UserRegister>({
    resolver: zodResolver(UserRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const password = useWatch({ control: form.control, name: "password" });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className={`space-y-4 p-4 rounded-md  ${
          error ? "border-2 border-red-500" : "border"
        }`}
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isLoading}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  disabled={isLoading}
                  onChange={(e) => {
                    field.onChange(e);
                    if (password !== e.target.value) {
                      form.setError("confirmPassword", {
                        type: "manual",
                        message: "Passwords do not match",
                      });
                    } else {
                      form.clearErrors("confirmPassword");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <LoadingIcon className="w-4 h-4" />}
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
