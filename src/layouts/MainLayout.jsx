import { Header } from "./Header";
import { headers } from "next/headers";
import { SplashScreen } from "./SplashScreen";
import PageTransitionEffect from "@/app/PageTransitionEffect";
import { Providers } from "./Providers";

const IOS = [
  "iPad Simulator",
  "iPhone Simulator",
  "iPod Simulator",
  "iPad",
  "iPhone",
  "iPod",
];

export const MainLayout = async ({ children }) => {
  const head = await headers();
  const userAgent = head.get("user-agent")?.toLowerCase() || "";
  const isIOS = IOS.some((device) => userAgent.includes(device.toLowerCase()));
  return (
    <>
      <Providers>
        <SplashScreen isIOS={isIOS} />
        <PageTransitionEffect>
          <main
            id="main-for-portals"
            className="overflow-hidden h-screen w-screen"
          >
            {children}
          </main>
        </PageTransitionEffect>
        <Header />
      </Providers>
    </>
  );
};
