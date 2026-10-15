import Sidebar from "@/app/components/admin/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  if (
    !adminEmail ||
    user.email?.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
