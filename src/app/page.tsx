import AuthWrapper from "@/auth/AuthWrapper";
import Home from "@/components/Home";

function Page() {
  return (
    <div className="h-full w-screen">
      <Home />
    </div>
  );
}

export default AuthWrapper(Page);
