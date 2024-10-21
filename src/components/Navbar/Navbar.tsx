"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { TLoginUser } from "@/types";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  // const LoggedIn = localStorage.getItem("isLoggedIn");

  // const accessToken =
  //   Cookies.get("accessToken") ||
  //   (typeof window !== "undefined"
  //     ? localStorage.getItem("accessToken")
  //     : localStorage.getItem("accessToken"));
  // const LoggedIn =
  //   typeof window !== "undefined"
  //     ? localStorage.getItem("isLoggedIn")
  //     : localStorage.getItem("isLoggedIn");

  let accessToken;
  let LoggedIn;

  if (typeof window !== "undefined") {
    // Only run this code on the client side
    accessToken =
      localStorage.getItem("accessToken") || Cookies.get("accessToken");
    LoggedIn = localStorage.getItem("isLoggedIn");
  } else {
    // Handle the case when running on the server (e.g., SSR or SSG)
    accessToken = null; // Or some fallback value
    LoggedIn = null; // Or some fallback value
  }

  // const accessToken =
  //   Cookies.get("accessToken") || localStorage.getItem("accessToken");
  // const LoggedIn = localStorage.getItem("isLoggedIn");

  useEffect(() => {
    if (accessToken && LoggedIn === "true") {
      const decodedToken = jwtDecode<TLoginUser>(accessToken);
      setRole(decodedToken.role);
      setIsLoggedIn(true);
    }
    if (!accessToken && LoggedIn === "false") {
      setIsLoggedIn(false);
    }
  }, [accessToken, LoggedIn]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://techx-server-five.vercel.app/api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.setItem("isLoggedIn", "false");
        setIsLoggedIn(false);
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  console.log("isLoggedIn", isLoggedIn);
  console.log("role", role);
  console.log("accesstoken", accessToken);
  console.log("loging", LoggedIn);

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
      <li>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="activeNavLink">
            Logout
          </button>
        ) : (
          <Link href="/login" className="activeNavLink">
            <button>Login</button>
          </Link>
        )}
      </li>
    </>
  );

  return (
    <div>
      <div className="navbar bg-[#1A4870] text-white">
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
          <Link href="/">
            <div className="flex flex-row items-center gap-2">
              <img
                src="https://i.postimg.cc/sDKNspNc/creative-computer-logo-template-23-2149213537.jpg"
                alt=""
                className="w-14 h-14 rounded-2xl"
              />
              <p className=" text-2xl font-bold text-[#F9DBBA] ">TechX</p>
            </div>
          </Link>
          {/* <a className="btn btn-ghost text-xl">TechX</a> */}
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
              className="menu menu-sm dropdown-content bg-[#1A4870] rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {/* {isLoggedIn ? (
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
              )} */}
              {role ? (
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
