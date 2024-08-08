import AuthWrapper from "@/auth/AuthWrapper";
import ProfileInfo from "@/components/ProfileInfo";
import GamesWindow from "@/components/GamesWindow";

function Home() {
  return (
      <main className="flex h-full">
        <div className="flex-grow flex-col border-r-4 border-indigo-400">
          <ProfileInfo />
        </div>
        <div className="flex-grow flex-col border-r-4 border-indigo-400">
          <div className="flex-grow">
            <GamesWindow /> 
          </div>
          <div className="flex-grow">
            Past Games
          </div>
        </div>
        <div className="flex-grow flex-col">
          Invitations Window
        </div>
      </main>
  );
}

export default AuthWrapper(Home);
