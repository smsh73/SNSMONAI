import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CrisisAlertProvider } from "@/components/crisis-alert-toast";
import { DrillDownProvider } from "@/contexts/drill-down-context";
import { DrillDownModal } from "@/components/drill-down/drill-down-modal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CrisisAlertProvider>
      <DrillDownProvider>
        <div className="min-h-screen bg-slate-950">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="pl-[240px]">
            <Header />
            <main className="min-h-[calc(100vh-56px)] p-4">{children}</main>
          </div>

          {/* Drill-down Modal */}
          <DrillDownModal />
        </div>
      </DrillDownProvider>
    </CrisisAlertProvider>
  );
}
