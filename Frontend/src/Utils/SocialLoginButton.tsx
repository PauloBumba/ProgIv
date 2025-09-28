import { type FC } from "react";
import { Button } from "primereact/button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://localhost:7184";
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || "https://localhost:5173";

interface SocialLoginButtonProps {
  icon: string;
  provider: "Google" | "Facebook";
  className?: string;
  severity?: "danger" | "info";
}

export const SocialLoginButton: FC<SocialLoginButtonProps> = ({
  icon,
  provider,
  className,
  severity,
}) => {
  
  const handleSocialLogin = () => {
    const returnUrl = `${FRONTEND_URL}/Auth/callback`;
    const loginUrl =
      provider === "Google"
        ? `${BACKEND_URL}/auth/login?provider=Google&returnUrl=${encodeURIComponent(returnUrl)}`
        : `${BACKEND_URL}/auth/login?provider=Facebook&returnUrl=${encodeURIComponent(returnUrl)}`;
    window.location.href = loginUrl;
  };

  return (
    <Button
      icon={icon}
      severity={severity}
      className={`border-circle h-4rem w-4rem ${className}`}
      onClick={handleSocialLogin}
      tooltip={`Login com ${provider}`}
      tooltipOptions={{ position: "bottom" }}
      type="button"
    />
   
    
  );
};
