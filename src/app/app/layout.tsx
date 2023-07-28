import { ReactNode } from "react";
import WithAppHeader from "./app-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <WithAppHeader>{children}</WithAppHeader>;
}
