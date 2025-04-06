import Home from "@/components/Home";
import { BannerWithMenu } from "@/components/Banner";

export default function Page() {
  return (
    <>
      <BannerWithMenu />
      <main className="flex justify-center pt-2">
        <Home />
      </main>
    </>
  );
}
