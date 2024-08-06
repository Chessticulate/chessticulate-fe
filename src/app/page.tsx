import AuthWrapper from "@/auth/AuthWrapper";
import ProfileInfo from "@/components/ProfileInfo";

function Home() {
  return (
    <div className="flex flex-col">
      <main className="flex-grow flex items-center">
        <div className="ml-10 mt-10 border-2">
          <ProfileInfo />
        </div>
      </main>
    </div>
  );
}

export default AuthWrapper(Home);
