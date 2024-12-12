import AuthWrapper from "@/auth/AuthWrapper";
import ProfileInfo from "@/components/ProfileInfo";
import GamesWindow from "@/components/games/GamesWindow";
import InvitationsWindow from "@/components/invitations/InvitationsWindow";

function Home() {
  return (
    <main className="flex h-full">
      <div className="basis-1/6 pl-5 pr-5">
        <ProfileInfo />
      </div>
      <div className="basis-3/6 pl-5 pr-5">
        <GamesWindow />
      </div>
      <div className="basis-2/6 pl-5 pr-5">
        <InvitationsWindow />
      </div>
    </main>
  );
}

export default AuthWrapper(Home);
