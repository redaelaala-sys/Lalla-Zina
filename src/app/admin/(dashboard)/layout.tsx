import AdminSidebar from "@/components/admin/AdminSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex">
      <AdminSidebar />
      <main className="flex-1 md:ms-60 p-6 md:p-10">{children}</main>
    </div>
  );
}
