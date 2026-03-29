import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-[250px]">
        {/* Top header bar */}
        <div className="flex items-center justify-end gap-4 px-6 py-3 border-b border-[rgba(176,199,217,0.145)]">
          <button
            type="button"
            className="text-[13px] text-[#A1A4A5] hover:text-[#F0F0F0] transition-colors flex items-center gap-1"
          >
            Feedback
            <kbd className="ml-1 px-1.5 py-0.5 text-[10px] bg-[rgba(176,199,217,0.1)] rounded border border-[rgba(176,199,217,0.2)]">
              F
            </kbd>
          </button>
          <button
            type="button"
            className="text-[13px] text-[#A1A4A5] hover:text-[#F0F0F0] transition-colors"
          >
            Help
          </button>
          <button
            type="button"
            className="text-[13px] text-[#A1A4A5] hover:text-[#F0F0F0] transition-colors"
          >
            Docs
          </button>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
