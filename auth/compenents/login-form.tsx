import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserLogin, UserLoginSchema } from "../shema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm({
  onSave,
  isLoading = false,
}: {
  onSave: (data: UserLogin) => void;
  isLoading: boolean;
}) {
  const form = useForm<UserLogin>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Email </FormLabel>{" "}
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  {...field}
                />{" "}
              </FormControl>{" "}
              <FormMessage />{" "}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Password </FormLabel>{" "}
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  {...field}
                />{" "}
              </FormControl>{" "}
              <FormMessage />{" "}
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {" "}
          Login{" "}
        </Button>{" "}
      </form>{" "}
    </Form>
  );
}
