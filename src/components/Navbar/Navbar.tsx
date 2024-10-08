"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { TLoginUser } from "@/types";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  // const accessToken = localStorage.getItem("accessToken");
  // const role = accessToken ? jwtDecode(accessToken).role : null;

  // useEffect(() => {
  //   // Check if the access token exists in localStorage
  //   const accessToken = localStorage.getItem("accessToken");
  //   if (accessToken) {
  //     setIsLoggedIn(true);
  //     setRole(jwtDecode<TLoginUser>(accessToken).role);
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const decodedToken = jwtDecode<TLoginUser>(accessToken);
        setIsLoggedIn(true);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent with the request
      });
      if (response.ok) {
        // Handle successful logout
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menu = (
    <>
      <li>
        <Link href="/" className="activeNavLink">
          <button>Home</button>
        </Link>
      </li>
      <li>
        <Link href="/about" className="activeNavLink">
          <button>About</button>
        </Link>
      </li>
      <li>
        <Link href="/contact" className="activeNavLink">
          <button>Contact</button>
        </Link>
      </li>
      <li>
        <Link href={`/profile/${role}`} className="activeNavLink">
          <button>Profile</button>
        </Link>
      </li>
    </>
  );

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {menu}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{menu}</ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {isLoggedIn ? (
                <>
                  <li>
                    <Link href={`/profile/${role}`}>Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="w-full text-left">
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link href="/login">Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
