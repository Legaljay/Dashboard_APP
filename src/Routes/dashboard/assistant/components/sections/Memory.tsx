import Tabs from "@/components/ui/Tabs";
import React, { useCallback, useMemo } from "react";
import Faqs from "../memory-tabs-common/components/Faqs";
import ProductsServices from "../memory-tabs-common/components/ProductsServices";
import Legal from "../memory-tabs-common/components/Legal";
import Support from "../memory-tabs-common/components/Support";
import Other from "../memory-tabs-common/components/Other";
import About from "../memory-tabs-common/components/About";
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
    <section className="w-full font-figtree">
      <MemoryHeader />
      <div className="flex flex-col justify-center items-center">
        <Tabs activeTab={activeTab} setActiveTab={switchTab} tabs={tabs} isImportant={[1,2,3]}/>
      </div>
      <div>
        {currentTabComponent}
      </div>
    </section>
  );
};

export default Memory;
