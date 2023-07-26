import Link from "next/link";

export default function AdminPage() {
  return (
    <div>
      AdminPage
      <Link href="/nested-admin">Nested</Link>
    </div>
  );
}
