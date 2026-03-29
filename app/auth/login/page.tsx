import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Login — Mooni Services" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
