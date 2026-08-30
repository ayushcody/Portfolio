import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin | Ayush Chougula",
  description: "Private portfolio control console.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return (
    <main className="min-h-screen relative selection:bg-cyan/30 selection:text-white">
      <AdminDashboard />
    </main>
  );
}
