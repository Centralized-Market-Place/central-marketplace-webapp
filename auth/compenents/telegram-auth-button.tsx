"use client";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { LoginButton } from "@telegram-auth/react";

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string | null;
  username?: string | null;
  photo_url?: string | null;
  auth_date: number;
  hash: string;
}

const TelegramLoginButton = () => {
  const router = useRouter();
  const { telegramLogin } = useAuth();

  const handleTelegramResponse = (response: TelegramAuthData) => {
    console.log("Telegram auth callback received user:", response);
    telegramLogin({
      telegramLogin: {
        id: response.id,
        first_name: response.first_name,
        last_name: response.last_name || null,
        username: response.username || null,
        photo_url: response.photo_url || null,
        auth_date: response.auth_date,
        hash: response.hash,
      },
      onSuccess: () => router.push("/"),
    });
  };

  return (
    <div className="my-1 mb-2">
      <LoginButton
        botUsername="central_marketplace_bot"
        buttonSize="large"
        onAuthCallback={handleTelegramResponse}
        requestAccess="write"
        showAvatar={false}
        lang="en"
        widgetVersion="22"
      />
    </div>
  );
};

export default TelegramLoginButton;
