import Navbar from "@/components/Navbar/Navbar";
import Providers from "@/lib/Providers";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <div className="bg-[#705C53] h-full min-h-full">
        <Navbar />
        {children}
      </div>
    </Providers>
  );
};

export default layout;
