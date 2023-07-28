import { prisma } from "@/lib/prisma";
import CreateChatBotForm from "./create-chatbot-form";
import { requireSession } from "@/lib/auth";
import { Organization } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function NewChatbotPage({
  searchParams,
}: {
  searchParams: { org?: string };
}) {
  const session = await requireSession();
  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (organizations.length === 0) {
    redirect(`/new-org?next='/new`);
  }

  let organization: Organization | undefined;
  if (searchParams.org) {
    organization = organizations.find((org) => org.slug == searchParams.org);
  }

  if (!organization || !searchParams.org) {
    const params = new URLSearchParams({ org: organizations[0].slug });
    redirect(`/new?${params.toString()}`);
  }

  return (
    <div className="container flex flex-col py-8">
      <div className="mb-8 grid">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Chatbot
        </h1>
      </div>
      <CreateChatBotForm
        organizations={organizations}
        organization={searchParams.org}
      />
    </div>
  );
}
