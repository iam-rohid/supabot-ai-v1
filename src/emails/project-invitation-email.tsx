import { APP_NAME, HOME_DOMAIN } from "@/lib/constants";
import {
  Body,
  Link,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function ProjectInvitationEmail({
  url,
  email,
  projectName,
  inviterEmail,
  inviterName,
}: {
  url: string;
  email: string;
  projectName: string;
  inviterName: string;
  inviterEmail: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>You are invited to a project on {APP_NAME}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Link
              href={HOME_DOMAIN}
              className="my-8 block w-full text-center text-3xl font-bold text-accent-foreground"
            >
              {APP_NAME}
            </Link>
            <Heading className="mx-0 my-6 p-0 text-xl font-semibold text-black">
              You are invited to a project on {APP_NAME}
            </Heading>
            <Text className="text-sm leading-6 text-black">
              Welcome to {APP_NAME}!
            </Text>
            <Text className="text-sm leading-6 text-black">
              {inviterName} ({inviterEmail}) has invited you to join the{" "}
              {projectName} project on {APP_NAME}!
            </Text>
            <Section className="my-8 text-center">
              <Link
                className="rounded-full bg-black px-6 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={url}
              >
                Join Project
              </Link>
            </Section>
            <Text className="text-sm leading-6 text-black">
              or copy and paste this URL into your browser:
            </Text>
            <Text className="max-w-sm flex-wrap break-words font-medium text-blue-500 no-underline">
              {url}
            </Text>
            <Text>
              This email was intended for{" "}
              <Link href={`mailto:${email}`}>{email}</Link>. If you were not
              expecting this email, you can ignore this email. If you are
              concerned about your account&apos;s safety, please reply to this
              email to get in touch with us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
