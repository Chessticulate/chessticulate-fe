import LoginSignup from "@/components/LoginSignup";
import { Banner } from "@/components/Banner";

export default function Login() {
  return (
    <>
      <Banner />
      <main className="flex justify-center pt-28">
        <LoginSignup />
      </main>
    </>
  );
}
