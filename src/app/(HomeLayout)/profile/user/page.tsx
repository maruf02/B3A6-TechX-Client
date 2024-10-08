import UserProfilePage from "@/components/UserPage/UserPage";
import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<p>loding</p>}>
        <UserProfilePage />
      </Suspense>
    </div>
  );
};

export default page;
