import Tabs from "@/components/ui/Tabs";
import React, { useCallback, useMemo } from "react";
import Faqs from "../Faqs";
import ProductsServices from "../ProductsServices";
import Legal from "../Legal";
import Support from "../Support";
import Other from "../Other";
import About from "../About";
import MemoryHeader from "./MemoryHeader";

const tabNames = [
  "About",
  "Faqs",
  "Products/Services",
  "Legal",
  "Support",
  "Other",
] as const;

const tabs: string[] = tabNames.map(tab => tab);

const Memory: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  const switchTab = useCallback((value: number) => {
    setActiveTab(value);
  }, []);

  const currentTabComponent = useMemo(() => {
    switch (activeTab) {
      case 0:
        return <About />;
      case 1:
        return <Faqs />;
      case 2:
        return <ProductsServices />;
      case 3:
        return <Legal />;
      case 4:
        return <Support />;
      case 5:
        return <Other />;
      default:
        return <About />;
    }
  }, [activeTab]);

  return (
    <section className="font-figtree w-full">
      <MemoryHeader />
      <div className="flex flex-col items-center justify-center">
        <Tabs activeTab={activeTab} setActiveTab={switchTab} tabs={tabs} />
      </div>
      <div>
        {currentTabComponent}
      </div>
    </section>
  );
};

export default Memory;
