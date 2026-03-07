import DriverSidebar from "@/components/DriverSidebar";
import Header from "@/components/Header";

export default function DriverLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DriverSidebar />
      <div className="ml-[200px] flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
