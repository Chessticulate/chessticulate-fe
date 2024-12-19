import AuthWrapper from "@/auth/AuthWrapper";
import ProfileInfo from "@/components/ProfileInfo";
import Dashboard from "@/components/Dashboard";

function Home() {
  return (
    <main className="flex h-full">
      <div className="basis-1/6 pl-5 pr-5">
        <ProfileInfo />
      </div>
      <div className="basis-5/6 pl-5 pr-5">
        <Dashboard />
      </div>
    </main>
  );
}

export default AuthWrapper(Home);
