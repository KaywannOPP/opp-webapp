export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(210_40%_96%)_0%,transparent_60%)] dark:bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(222_47%_11%)_0%,transparent_60%)]">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-stretch px-4">
        {/* Removed the logo from here so it doesn't push the form down */}
        <div className="py-6" />
        <main className="flex flex-1 items-start justify-center">
          <div className="w-full">{children}</div>
        </main>
        <footer className="py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} On Pitch Performance
        </footer>
      </div>
    </div>
  );
}
