import TitleBar from "@/components/title-bar";
import AddLinkButton from "./add-link-button";
import LinksList from "./links-list";

export default async function LinksPage() {
  return (
    <>
      <TitleBar title="Links">
        <AddLinkButton />
      </TitleBar>

      <div className="main container py-8">
        <LinksList />
      </div>
    </>
  );
}
