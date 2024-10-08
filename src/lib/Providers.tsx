"use client";

import { store } from "@/Redux/store";
import { Provider } from "react-redux";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
// const Providers = ({ children, session }) => {
//   return <SessionProvider session={session}>{children}</SessionProvider>;
// };

export default Providers;
