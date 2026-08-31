import { Sidebar } from "@/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="ml-60 min-h-screen px-10 py-9">
        <div className="mx-auto w-full max-w-5xl">{children}</div>
      </main>
    </>
  );
}
