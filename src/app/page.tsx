import AuthWrapper from "@/auth/AuthWrapper";
import ProfileInfo from "@/components/ProfileInfo";
import GamesWindow from "@/components/games/GamesWindow";
import InvitationsWindow from "@/components/invitations/InvitationsWindow";

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
      </div>
      <div className="flex-grow flex-col">
        <InvitationsWindow />
      </div>
    </main>
  );
}

export default AuthWrapper(Home);
