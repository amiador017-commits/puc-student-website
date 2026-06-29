import AuthForm from "../../components/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — PUC Student Portal",
  description: "Create an account on the PUC Student Portal to track courses, schedules, and grades.",
};

export default function SignupPage() {
  return <AuthForm initialMode="signup" />;
}
