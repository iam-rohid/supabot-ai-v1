import AccountDeleteCard from "./account-delete-card";
import AccountEmailCard from "./account-email-card";
import AccountNameCard from "./account-name-card";
import { getSession } from "@/utils/session";

export default async function UserSettings() {
  const session = await getSession();

  if (!session) {
    throw "UNAUTHORIZED";
  }

  return (
    <div className="grid gap-8">
      <AccountNameCard session={session} />
      <AccountEmailCard email={session.user.email || ""} />
      <AccountDeleteCard />
    </div>
  );
}
