"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const NulProfile = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000); // 5000ms = 5 seconds

    // Clean up the timeout if the component is unmounted
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>Please login to see the Profile page. Redirecting in 2 seconds...</div>
  );
};

export default NulProfile;
