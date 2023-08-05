export default function HeaderMessage() {
  if (process.env.NODE_ENV === "development") {
    return null;
  }
  return (
    <div className="flex h-8 items-center justify-center bg-orange-100 text-center text-sm text-orange-900">
      <p>This site is under development. Anything you do might get deleted.</p>
    </div>
  );
}
