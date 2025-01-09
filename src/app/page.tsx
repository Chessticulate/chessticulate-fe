import AuthWrapper from "@/auth/AuthWrapper";
import Home from "@/components/Home";

function Page() {
  return (
    <main className="flex h-full">
      <Home />
    </main>
  );
}

export default AuthWrapper(Page);
