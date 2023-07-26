import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Sign up to ${APP_NAME}`,
};

export default function SignUpPage() {
  return <div>SignUpPage</div>;
}
