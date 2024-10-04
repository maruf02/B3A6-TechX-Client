"use client";
import { useRegisterUserMutation } from "@/Redux/api/baseApi";
import { Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";

const SignUpPage = () => {
  const [registerUser] = useRegisterUserMutation();
  const [form] = Form.useForm();
  const router = useRouter();
  const onFinish = (values: any) => {
    const userInfo = {
      name: values.name,
      email: values.email,
      role: "user",
      password: values.password,
      phone: values.phone,
      address: "",
      profileImage:
        "https://images.pexels.com/photos/751005/pexels-photo-751005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      coverImage:
        "https://images.pexels.com/photos/40731/ladybug-drop-of-water-rain-leaf-40731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    };
    console.log("object", userInfo);
    registerUser(userInfo)
      .unwrap()
      .then((res) => {
        // Handle successful signup, e.g., redirect or show success message
        console.log("Success:", res);
        Swal.fire(res.message);
        router.push("/login");
      })
      .catch((error) => {
        // Handle errors
        console.log("Error:", error);
        if (error.data.message.includes("E11000 duplicate key")) {
          Swal.fire("Already Register, Please signIN");
        }
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className="w-full h-full min-h-screen bg-white">
        <div className="m-0 font-sans antialiased font-normal bg-white text-start text-base leading-default text-slate-500">
          <div className="container sticky top-0 z-sticky">
            <div className="flex flex-wrap -mx-3">
              <div className="w-full max-w-full px-3 flex-0"></div>
            </div>
          </div>
          <main className="mt-0 transition-all duration-200 ease-soft-in-out">
            <section>
              <div className="relative flex items-center p-0 overflow-hidden bg-center bg-cover min-h-75-screen">
                <div className="container z-10">
                  <div className="flex flex-wrap mt-0 -mx-3">
                    <div className="flex flex-col w-full max-w-full px-3 mx-auto md:flex-0 shrink-0 md:w-6/12 lg:w-6/12 xl:w-5/12">
                      <div className="relative flex flex-col min-w-0 mt-32 break-words bg-transparent border-0 shadow-none rounded-2xl bg-clip-border">
                        <div className="p-6 pb-0 mb-0 bg-transparent border-b-0 rounded-t-2xl">
                          <h3 className="relative z-10 font-bold text-transparent bg-gradient-to-tl from-blue-600 to-cyan-400 bg-clip-text">
                            Welcome to join
                          </h3>
                          <p className="mb-0">
                            Enter your details to create an account
                          </p>
                        </div>
                        <div className="flex-auto p-6">
                          {/* Form Start */}
                          <Form
                            form={form}
                            name="register"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            scrollToFirstError
                          >
                            <Form.Item
                              name="name"
                              label="Name"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input your name!",
                                },
                              ]}
                            >
                              <Input className="lg:ml-16 lg:w-9/12" />
                            </Form.Item>

                            <Form.Item
                              name="email"
                              label="Email"
                              rules={[
                                {
                                  type: "email",
                                  message: "The input is not valid E-mail!",
                                },
                                {
                                  required: true,
                                  message: "Please input your E-mail!",
                                },
                              ]}
                            >
                              <Input className="lg:ml-16 lg:w-9/12" />
                            </Form.Item>

                            <Form.Item
                              name="password"
                              label="Password"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input your password!",
                                },
                              ]}
                              hasFeedback
                            >
                              <Input.Password className="lg:ml-10 lg:w-9/12" />
                            </Form.Item>

                            <Form.Item
                              name="confirm"
                              label="Confirm Password"
                              dependencies={["password"]}
                              hasFeedback
                              rules={[
                                {
                                  required: true,
                                  message: "Please confirm your password!",
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (
                                      !value ||
                                      getFieldValue("password") === value
                                    ) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      new Error(
                                        "The two passwords that you entered do not match!"
                                      )
                                    );
                                  },
                                }),
                              ]}
                            >
                              <Input.Password className="lg:w-10/12" />
                            </Form.Item>
                            <Form.Item
                              name="phone"
                              label="Phone Number"
                              rules={[
                                {
                                  required: true,
                                  message: "Please input your phone number!",
                                },
                              ]}
                            >
                              <Input className="lg:ml-6 lg:w-10/12" />
                            </Form.Item>
                            <div>
                              <Form.Item
                                name="agreement"
                                valuePropName="checked"
                                rules={[
                                  {
                                    validator: (_, value) =>
                                      value
                                        ? Promise.resolve()
                                        : Promise.reject(
                                            new Error(
                                              "You must accept the agreement"
                                            )
                                          ),
                                  },
                                ]}
                              >
                                <Checkbox className="ml-2">
                                  <p
                                    onClick={() => {
                                      const modal = document.getElementById(
                                        "term&condition"
                                      ) as HTMLDialogElement;
                                      if (modal) {
                                        modal.showModal();
                                      }
                                    }}
                                    className="pt-4 text-green-600"
                                  >
                                    I agree to the terms and conditions
                                  </p>
                                </Checkbox>
                              </Form.Item>
                            </div>
                            <Form.Item>
                              <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full bg-black"
                              >
                                Sign up
                              </Button>
                            </Form.Item>
                          </Form>
                          {/* Form End */}
                        </div>
                        <div className="p-0 px-1 pt-0 text-center bg-transparent border-t-0 border-t-solid rounded-b-2xl lg:px-2">
                          <p className="mx-auto mb-2 leading-normal text-sm">
                            Already have an account?
                            <h1 className="relative z-10 font-semibold text-transparent bg-gradient-to-tl from-blue-600 to-cyan-400 bg-clip-text pl-2 text-md">
                              <Link href="/login">Sign in</Link>
                            </h1>
                          </p>
                        </div>
                        <div className="p-0 px-1 pt-0 text-center bg-transparent border-t-0 border-t-solid rounded-b-2xl lg:px-2">
                          <p className="mx-auto mb-6 leading-normal text-sm">
                            <button
                              onClick={() => {
                                const modal = document.getElementById(
                                  "term&condition"
                                ) as HTMLDialogElement;
                                if (modal) {
                                  modal.showModal();
                                }
                              }}
                              className="relative z-10 font-semibold text-transparent bg-gradient-to-tl from-blue-600 to-cyan-400 bg-clip-text pr-5"
                            >
                              Privacy Policy
                            </button>
                            <button
                              onClick={() => {
                                const modal = document.getElementById(
                                  "term&condition"
                                ) as HTMLDialogElement;
                                if (modal) {
                                  modal.showModal();
                                }
                              }}
                              className="relative z-10 font-semibold text-transparent bg-gradient-to-tl from-blue-600 to-cyan-400 bg-clip-text"
                            >
                              Terms of Service
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <dialog id="term&condition" className="modal">
              <div className="modal-box bg-white">
                <div className="container mx-auto p-6">
                  <h1 className="text-2xl font-bold mb-4">
                    Car Rental Policies
                  </h1>

                  {/* Terms and Conditions */}
                  <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                      Terms and Conditions
                    </h2>
                    <p className="mb-4">
                      <strong>1. Rental Agreement:</strong> By renting a vehicle
                      from [Your Company Name], you agree to the terms and
                      conditions set forth in this agreement. The renter must
                      hold a valid drivers license and meet the age requirements
                      specified by [Your Company Name]. The rental period,
                      payment terms, and vehicle return conditions are agreed
                      upon at the time of rental.
                    </p>
                    <p className="mb-4">
                      <strong>2. Vehicle Use:</strong> The rented vehicle must
                      be used in a safe and lawful manner. The renter is
                      responsible for any damage, loss, or theft of the vehicle
                      during the rental period. The vehicle must not be used for
                      illegal activities, racing, or towing. Only authorized
                      drivers listed in the rental agreement are allowed to
                      operate the vehicle.
                    </p>
                    <p className="mb-4">
                      <strong>3. Insurance and Liability:</strong> The renter is
                      responsible for any damage to the vehicle, as well as
                      third-party injuries or property damage, unless covered by
                      insurance. Additional insurance options may be available
                      at the time of rental. The renter must report any
                      accidents or damage to [Your Company Name].
                    </p>
                  </section>

                  {/* Privacy Policy */}
                  <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                      Privacy Policy
                    </h2>
                    <p className="mb-4">
                      [Your Company Name] is committed to protecting your
                      privacy. We collect personal information necessary for
                      providing our services, such as your name, contact
                      details, and payment information. This information is used
                      solely for the purposes of processing your rental and
                      improving our services. We do not share your personal
                      information with third parties without your consent,
                      except as required by law.
                    </p>
                    <p className="mb-4">
                      We use secure systems to protect your data and ensure that
                      your personal information is handled with care. You have
                      the right to access, update, or delete your personal
                      information by contacting us directly.
                    </p>
                    <p className="mb-4">
                      By using our services, you agree to the collection and use
                      of your personal information in accordance with this
                      Privacy Policy.
                    </p>
                  </section>

                  {/* Terms of Service */}
                  <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                      Terms of Service
                    </h2>
                    <p className="mb-4">
                      By accessing and using our website, you agree to comply
                      with these Terms of Service. You are responsible for
                      maintaining the confidentiality of your account
                      information and for all activities that occur under your
                      account. You agree to notify [Your Company Name]
                      immediately of any unauthorized use of your account or any
                      other breach of security.
                    </p>
                    <p className="mb-4">
                      [Your Company Name] reserves the right to modify or
                      terminate the service at any time without prior notice. We
                      may also update these terms from time to time, and it is
                      your responsibility to review them regularly.
                    </p>
                    <p className="mb-4">
                      Your continued use of the service after any changes to the
                      Terms of Service will constitute your acceptance of such
                      changes.
                    </p>
                  </section>
                </div>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
