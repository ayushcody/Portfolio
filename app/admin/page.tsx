import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  description: "Private portfolio content console.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminPage() {
  return (
    <main className="adm-main">
      <AdminDashboard />
    </main>
  );
}
