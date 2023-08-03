import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <main className="container py-32 text-center">
      <Image
        src="/assets/page-not-found-light.png"
        alt="Page not found"
        className="h-96 w-full object-contain dark:hidden"
        width={860.13137}
        height={571.14799}
      />
      <Image
        src="/assets/page-not-found-dark.png"
        alt="Page not found"
        className="hidden h-96 w-full object-contain dark:block"
        width={860.13137}
        height={571.14799}
      />
      <p className="mt-16 text-2xl font-medium">Project Not Found!</p>
      <Button variant="link" asChild>
        <Link href="/dashboard" className="mt-4">
          <ArrowLeft className="-ml-1 mr-2 h-4 w-4" />
          Go to Dashboard
        </Link>
      </Button>
    </main>
  );
}
