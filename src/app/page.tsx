import AuthWrapper from "@/auth/AuthWrapper";
import ProfileInfo from "@/components/ProfileInfo";
import ActiveGamesWindow from "@/components/games/ActiveGamesWindow";
import PastGamesWindow from "@/components/games/PastGamesWindow";
import InvitationsWindow from "@/components/invitations/InvitationsWindow";

function Home() {
  return (
    <main className="flex h-full">
      <div className="flex-grow flex-col border-r-4 border-indigo-400">
        <ProfileInfo />
      </div>
      <div className="flex-grow flex-col border-r-4 border-indigo-400">
        <div className="flex-grow">
          <ActiveGamesWindow />
        </div>
        <div className="flex-grow">
          <PastGamesWindow />
        </div>
      </div>
      <div className="flex-grow flex-col">
        <InvitationsWindow />
      </div>
    </main>
  );
}

export default AuthWrapper(Home);
