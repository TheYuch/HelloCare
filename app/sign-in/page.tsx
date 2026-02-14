import type { Metadata } from "next";
import { SignInClient } from "./SignInClient";

export const metadata: Metadata = {
  title: "Sign in | HelloCare",
  description: "Sign in to HelloCare with Google or Microsoft",
};

export default function SignInPage() {
  return <SignInClient />;
}
