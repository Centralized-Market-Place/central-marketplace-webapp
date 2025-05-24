"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailSetupForm } from "./email-setup-form";

export function TelegramEmailSetup() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Email Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Please add an email address to your account. This will allow you to
          log in using email and password in addition to Telegram.
        </p>
        <EmailSetupForm />
      </CardContent>
    </Card>
  );
}
