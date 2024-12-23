import { useEffect, useState } from "react";
import Mobile from "./Assets/Mobileprompt.png";
import { Outlet } from "react-router-dom";


// Root Layout - handles mobile check
const RootLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (isMobile) {
    return (
      <div>
        <img src={Mobile} alt="Device Notice" />
      </div>
    );
  }

  return <div className="h-screen w-screen bg-[#F7F7F7] dark:bg-background-dark"><Outlet /></div>;
};

export default RootLayout;
