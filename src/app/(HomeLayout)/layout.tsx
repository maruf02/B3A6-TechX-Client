import Navbar from "@/components/Navbar/Navbar";
import Providers from "@/lib/Providers";
import { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <div>
        <Navbar />
        {children}
      </div>
    </Providers>
  );
};

export default layout;
