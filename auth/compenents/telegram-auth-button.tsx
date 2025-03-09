"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { TelegramLogin } from "../shema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramLogin) => void;
  }
}

const TelegramLoginButton = ({ login = false}: { login?: boolean }) => {
  const [showWidget, setShowWidget] = useState(false);
  const router = useRouter();
  const { telegramLogin, telegramLoginLoading } = useAuth();

  useEffect(() => {
    if (!showWidget) return;

    window.onTelegramAuth = async (user: TelegramLogin) => {
      console.log("Telegram auth callback received user:", user);
      telegramLogin({
        telegramLogin: user,
        onSuccess: () => router.push("/"),
      });
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", "central_marketplace_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    const container = document.getElementById("telegram-login-container");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
    return () => {
      delete window.onTelegramAuth;
    };
  }, [showWidget, telegramLogin, router]);

  return (
    <div>
      <Button
        disabled={telegramLoginLoading}
        onClick={() => setShowWidget(true)}
      >
        {login ? "Login with Telegram" : "Register with Telegram"}
      </Button>

      {showWidget && <div id="telegram-login-container" />}
    </div>
  );
};

export default TelegramLoginButton;
