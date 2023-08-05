import GithubIcon from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import { GITHUB_REPO } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="my-32">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-6xl font-bold leading-none">
            Integrate ChatGPT on your Site with Ease
          </h1>
          <p className="mt-8 text-xl leading-snug text-muted-foreground">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime,
            iure exercitationem blanditiis ipsa vero consequuntur.
          </p>
          <div className="mt-16 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signin">
                Start for Free
                <ChevronRight className="-mr-1 ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={GITHUB_REPO}>
                <GithubIcon className="-ml-1 mr-2 text-xl" />
                Star on Github
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
