"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import Cookies from "js-cookie"; // Import js-cookie to set tokens
import { useLoginUserMutation } from "@/Redux/api/baseApi";

type FormValues = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const onSubmit = async (formData: FormValues) => {
    try {
      const res = await loginUser(formData).unwrap(); // Unwrap the promise from RTK Query

      if (res?.data?.accessToken) {
        // Set tokens in cookies
        Cookies.set("accessToken", res.data.accessToken, {
          secure: true,
          httpOnly: false, // Client can read this cookie (adjust as needed)
          sameSite: "strict",
        });
        Cookies.set("refreshToken", res.data.refreshToken, {
          secure: true,
          httpOnly: false, // Client can read this cookie (adjust as needed)
          sameSite: "strict",
        });

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("accessToken", res.data.accessToken);
        setIsLoggedIn(true);
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-white">
        <div className="m-0 font-sans antialiased font-normal bg-white text-start text-base leading-default text-slate-500">
          <div className="container sticky top-0 z-sticky">
            <div className="flex flex-wrap -mx-3">
              <div className="w-full max-w-full px-3 flex-0">
                {/* Navbar */}
              </div>
            </div>
          </div>
          <main className="mt-0 transition-all duration-200 ease-soft-in-out">
            <section>
              <div className="relative flex items-center p-0 overflow-hidden bg-center bg-cover min-h-75-screen">
                <div className="container z-10">
                  <div className="flex flex-wrap mt-0 -mx-3">
                    <div className="flex flex-col w-full max-w-full px-3 mx-auto md:flex-0 shrink-0 md:w-6/12 lg:w-5/12 xl:w-4/12">
                      <div className="relative flex flex-col min-w-0 mt-32 break-words bg-transparent border-0 shadow-none rounded-2xl bg-clip-border">
                        <div className="p-6 pb-0 mb-0 bg-transparent border-b-0 rounded-t-2xl">
                          <h3 className="relative z-10 font-bold text-transparent bg-gradient-to-tl from-blue-600 to-cyan-400 bg-clip-text">
                            Welcome back
                          </h3>
                          <p className="mb-0">
                            Enter your email and password to sign in
                          </p>
                        </div>
                        <div className="flex-auto p-6">
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <label className="mb-2 ml-1 font-bold text-xs text-slate-700">
                              Email
                            </label>
                            <div className="mb-4">
                              <input
                                type="email"
                                {...register("email", { required: true })}
                                className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
                                placeholder="Enter Your Email"
                              />
                              {errors.email && (
                                <p className="text-red-500 text-xs">
                                  Email is required
                                </p>
                              )}
                            </div>

                            <label className="mb-2 ml-1 font-bold text-xs text-slate-700">
                              Password
                            </label>
                            <input
                              type="password"
                              {...register("password", { required: true })}
                              className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
                              placeholder="Enter Your Password"
                            />
                            {errors.password && (
                              <p className="text-red-500 text-xs">
                                Password is required
                              </p>
                            )}

                            <div className="text-center">
                              <button
                                type="submit"
                                className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all bg-transparent border-0 rounded-lg cursor-pointer shadow-soft-md bg-x-25 bg-150 leading-pro text-xs ease-soft-in tracking-tight-soft bg-gradient-to-tl from-blue-600 to-cyan-400 hover:scale-102 hover:shadow-soft-xs active:opacity-85"
                              >
                                {isLoading ? "Signing in..." : "Sign in"}
                              </button>
                            </div>
                          </form>
                          {error && (
                            <p className="text-red-500 mt-2">
                              {error?.data?.message || "Login failed"}
                            </p>
                          )}
                        </div>
                        <div className="p-6 px-1 pt-0 text-center bg-transparent border-t-0 border-t-solid rounded-b-2xl lg:px-2">
                          <p className="mx-auto mb-6 leading-normal text-lg">
                            Dont have an account?
                            <Link href="/signup">
                              <span className="relative z-10 font-semibold text-transparent bg-gradient-to-tl from-blue-600 to-cyan-400 bg-clip-text pl-2">
                                Sign up
                              </span>
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
