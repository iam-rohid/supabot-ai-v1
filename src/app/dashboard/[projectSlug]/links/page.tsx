import PageHeader from "@/components/page-header";
import AddLinkButton from "./add-link-button";
import LinksList from "./links-list";

export default async function LinksPage() {
  return (
    <>
      <PageHeader title="Links">
        <AddLinkButton />
      </PageHeader>

      <div className="main container py-8">
        <LinksList />
      </div>
    </>
  );
}
