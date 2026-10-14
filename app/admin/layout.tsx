import Sidebar from "@/app/components/admin/Sidebar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}