import { Session } from "next-auth";
import AccountDeleteCard from "./account-delete-card";
import AccountEmailCard from "./account-email-card";
import AccountNameCard from "./account-name-card";
import { getSession } from "@/utils/session";

export default async function UserSettings() {
  const session = (await getSession()) as Session;

  return (
    <div className="grid gap-8">
      <AccountNameCard session={session} />
      <AccountEmailCard email={session.user.email || ""} />
      <AccountDeleteCard />
    </div>
  );
}
