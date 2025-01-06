import AuthWrapper from "@/auth/AuthWrapper";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

function Home() {
  return (
    <main className="flex h-full">
      <div className="basis-1/7 pr-5">
        <Sidebar />
      </div>
      <div className="basis-6/7 pl-5 r-5">
        <Dashboard />
      </div>
    </main>
  );
}

export default AuthWrapper(Home);
