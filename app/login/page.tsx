import AuthForm from "../../components/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login — PUC Student Portal",
  description: "Sign in to your PUC Student account to track courses, routines, and grades.",
};

export default function LoginPage() {
  return <AuthForm initialMode="login" />;
}
