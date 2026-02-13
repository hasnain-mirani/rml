import AdminShell from "@/components/admin/AdminShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Force dark mode inside admin only
  return (
    <div className="dark">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
