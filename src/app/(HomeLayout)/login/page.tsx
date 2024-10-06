"use client";
import { useState } from "react";
import Cookies from "js-cookie"; // Import js-cookie to set tokens
import Swal from "sweetalert2";
import { Form, Input } from "antd";

import {
  useGetUserEmailQuery,
  useLoginUserMutation,
  useUpdatePasswordMutation,
} from "@/Redux/api/baseApi";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FieldType = {
  password?: string;
};

type User = {
  role?: string;
};
interface ErrorResponse {
  data?: {
    message?: string;
  };
}

const LoginPage = () => {
  // const [form] = Form.useForm();
  const router = useRouter();

  const [resetLink, setResetLink] = useState("");
  const [email, setEmail] = useState("");
  const [showResetLink, setShowResetLink] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const [updatePassword] = useUpdatePasswordMutation();
  const { data: userData, isError } = useGetUserEmailQuery(email);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // login portion
  // console.log(userData);
  const handleLogin = async (event: any) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    // const userInfo = {
    //   email: data.email,
    //   password: data.password,
    // };
    const userInfo = { email, password };

    try {
      const res = await loginUser(userInfo).unwrap();
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
      const error = err as ErrorResponse;
      if (error.data?.message) {
        // console.error("Login error:", err.data.message);
        Swal.fire("Error", error.data.message as string, "error");
      } else {
        // console.error("Login error:", err);
        Swal.fire("Error", "An unexpected error occurred.", "error");
      }
    }
  };

  // login portion

  // **************************************

  const handleResetPass = () => {
    const modal = document.getElementById(
      "ForgetPassModal"
    ) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
    setShowSuccessModal(true);
  };
  // **************************************

  // **************************************

  const handleEmailConfirmForReset = (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = form.email.value;

    setEmail(email);

    // console.log("email", isError);

    if (!isError) {
      const randomToken = Math.random().toString(36).substr(2, 16); // Generating a random token
      const generatedLink = `https://maruf-k20.com/reset-password?token=${randomToken}`;
      setResetLink(generatedLink);
      setShowResetLink(true);
      setTimeout(() => {
        setShowResetLink(false);
      }, 10000);
    }
    // console.log("object", userData);
  };
  // **************************************

  // **************************************
  const updateNewPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const emailT = form.emailT.value;
    const password = form.password.value;
    // console.log("object", email, password);
    // console.log("object", error);
    try {
      await updatePassword({
        email: emailT,
        password: password,
      }).unwrap();
      Swal.fire("Success", "Password updated successfully!", "success");
      const modal = document.getElementById(
        "ResetPassModal"
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update password.", "error");
    }
  };
  // **************************************

  // **************************************

  return (
    <div className="min-h-screen bg-white">
      <div className="m-0 font-sans antialiased font-normal bg-white text-start text-base leading-default text-slate-500">
        <div className="w-full max-w-full   flex-0">
          {/* <!-- Navbar --> */}
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
                        {/* sign in form start */}

                        <form onSubmit={handleLogin}>
                          <label className="mb-2 ml-1 font-bold text-xs text-slate-700">
                            Email
                          </label>
                          <div className="mb-4">
                            <input
                              type="email"
                              name="email"
                              required
                              className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
                              placeholder="Enter Your Email"
                            />
                          </div>
                          <label className="mb-2 ml-1 font-bold text-xs text-slate-700">
                            Password
                          </label>
                          {/* <div className="mb-4">
                            <input
                              type="password"
                              name="password"
                              className="focus:shadow-soft-primary-outline text-sm leading-5.6 ease-soft block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 transition-all focus:border-fuchsia-300 focus:outline-none focus:transition-shadow"
                              placeholder="Password"
                            />
                          </div> */}
                          <Form.Item<FieldType>
                            // label="Password"
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: "Please input your password!",
                              },
                            ]}
                          >
                            <Input.Password />
                          </Form.Item>

                          <div className="text-center">
                            <button className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all bg-transparent border-0 rounded-lg cursor-pointer shadow-soft-md bg-x-25 bg-150 leading-pro text-xs ease-soft-in tracking-tight-soft bg-gradient-to-tl from-blue-600 to-cyan-400 hover:scale-102 hover:shadow-soft-xs active:opacity-85">
                              Sign in
                            </button>
                          </div>
                        </form>
                        {/* <div className="text-center">
                          <button className="inline-block w-full px-6 py-3 mt-6 mb-0 font-bold text-center text-white uppercase align-middle transition-all bg-transparent border-0 rounded-lg cursor-pointer shadow-soft-md bg-x-25 bg-150 leading-pro text-xs ease-soft-in tracking-tight-soft bg-gradient-to-tl from-blue-600 to-cyan-400 hover:scale-102 hover:shadow-soft-xs active:opacity-85">
                            Sign in
                          </button>
                        </div> */}
                        {/* </form> */}
                        {/* sign in form start */}
                        {/* ********************************* */}
                        <div className="flex mx-auto justify-center pt-0 z-0">
                          <button
                            onClick={() => {
                              const modal = document.getElementById(
                                "ForgetPassModal"
                              ) as HTMLDialogElement;
                              if (modal) {
                                modal.showModal();
                              }
                            }}
                            className="pt-3 mx-auto text-green-700   flex justify-between"
                          >
                            <a className="text-center font-semibold">
                              Forgot Your password?
                            </a>
                          </button>
                          <dialog id="ForgetPassModal" className="modal  ">
                            <div className="modal-box bg-[#1A4870]  ">
                              <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <form onSubmit={handleEmailConfirmForReset}>
                                <div className="flex justify-center pt-5 ">
                                  <h1 className="text-white text-3xl ">
                                    Reset Your Password
                                  </h1>
                                </div>
                                <p className="border border-1 border-gray-400 my-3 "></p>
                                <div className="flex flex-col gap-2">
                                  <div>
                                    <label className="pr-12 text-white">
                                      Email:
                                    </label>
                                    <input
                                      type="email"
                                      //   defaultValue="abc@gmai.com"
                                      required
                                      name="email"
                                      placeholder="Enter your Email"
                                      className="input input-bordered input-primary w-full max-w-xs bg-inherit text-white"
                                    />
                                  </div>

                                  <div className="flex justify-center my-5  ">
                                    <button className="flex text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-full text-2xl pb-1 ">
                                      confirm Your Email
                                    </button>
                                  </div>
                                  <div className="text-lg pt-3 text-center"></div>
                                </div>
                              </form>
                              {isError ? (
                                <p className="text-red-500 text-md">
                                  Please Enter created Email Or Create ne
                                  account
                                </p>
                              ) : (
                                showResetLink && (
                                  <button
                                    onClick={handleResetPass}
                                    className="text-green-500 text-xl"
                                  >
                                    Reset Link: {resetLink}
                                  </button>
                                )
                              )}
                            </div>
                          </dialog>
                        </div>
                        {/* **************************************************** */}
                      </div>
                      <div className="p-6 px-1 pt-0 text-center bg-transparent border-t-0 border-t-solid rounded-b-2xl lg:px-2">
                        <p className="mx-auto mb-6 leading-normal text-lg  ">
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
                  {/* <div className="w-full max-w-full px-3 lg:flex-0 shrink-0 md:w-6/12">
                    <div className="absolute top-0 hidden w-3/5 h-full -mr-32 overflow-hidden -skew-x-10 -right-40 rounded-bl-xl md:block">
                      <div
                        className="absolute inset-x-0 top-0 z-0 h-full -ml-16 bg-cover skew-x-10"
                        style={{
                          backgroundImage:
                            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
                        }}
                      ></div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </section>
        </main>
        {/* **************************************************** */}
        {/* Success Modal */}
        {showSuccessModal && (
          <dialog id="ResetPassModal" open className="modal">
            <div className="modal-box bg-[#1A4870]">
              <div>
                <form onSubmit={updateNewPassword}>
                  <div className="flex justify-center pt-5 ">
                    <h1 className="text-white text-3xl ">Set New Password</h1>
                  </div>
                  <p className="border border-1 border-gray-400 my-3 "></p>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="pr-12 text-white">Email:</label>
                      <input
                        type="email"
                        defaultValue={email}
                        readOnly
                        name="emailT"
                        placeholder="Enter your Email"
                        className="input input-bordered input-sm input-primary w-full max-w-xs bg-inherit text-white"
                      />
                    </div>
                    <div className="pt-2">
                      {/* <label className="pr-2 text-white">New Password:</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter your Password"
                        className="input input-bordered input-primary w-full max-w-xs bg-inherit text-white"
                      /> */}
                      <Form.Item<FieldType>
                        label="Password"
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </div>

                    <div className="flex justify-center my-5  ">
                      <button className="flex text-white btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-full text-2xl pb-1 ">
                        Update Password
                      </button>
                    </div>
                    <div className="text-lg pt-3 text-center"></div>
                  </div>
                </form>
              </div>
              {/* <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="btn btn-primary"
                >
                  Close
                </button>
              </div> */}
            </div>
          </dialog>
        )}

        {/* *************************************************************** */}
      </div>
    </div>
  );
};

export default LoginPage;
