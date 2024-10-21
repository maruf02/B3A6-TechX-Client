"use client";
import { IoAddCircleOutline } from "react-icons/io5";

import Swal from "sweetalert2";

import { useState } from "react";
import { GrTransaction } from "react-icons/gr";
import {
  useAddUserMutation,
  useDeleteUserMutation,
  useGetAllUserQuery,
  useUpdateUserMutation,
} from "@/Redux/api/baseApi";
import { TUser } from "@/types";
import { MdDeleteForever } from "react-icons/md";

const UserManagement = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");

  // console.log("selectedUser", selectedUser);
  const { data: user, refetch } = useGetAllUserQuery(undefined);
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [deleteCar] = useDeleteCarMutation();

  const users = user?.data || [];
  // console.log("object", users);

  const roles = ["admin", "user"];
  const isBlocks = ["Yes", "No"];

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const name = form.nameT.value;
    const email = form.email.value;
    // const image = form.image.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const Role = selectedRole;
    const isBlock = selectedBlock;

    const userData = {
      name,
      email,
      password: "password1234",
      profileImage:
        "https://images.pexels.com/photos/751005/pexels-photo-751005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      coverImage:
        "https://images.pexels.com/photos/40731/ladybug-drop-of-water-rain-leaf-40731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      phone,
      address,
      Role,
      isBlock,
    };
    // console.log("productData", productData);

    try {
      await addUser(userData).unwrap();
      // console.log("Product added:", response);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500,
      });

      setIsModalOpen(false);
      refetch();
    } catch {
      // console.error("Failed to add product:", error);
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((p: TUser) => p._id === userId);
    if (user) {
      setSelectedUserId(userId);
      setSelectedUser(user);
      setSelectedRole(user.role);
      setSelectedBlock(user.isBlock);
    }
  };

  const handleEditFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const name = form.nameT.value;
    const email = form.email.value;
    // const image = form.image.value;
    const phone = form.phone.value;
    const address = form.address.value;

    const userModifyData = {
      name,
      email,
      // password: "password1234",
      profileImage:
        "https://images.pexels.com/photos/751005/pexels-photo-751005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      coverImage:
        "https://images.pexels.com/photos/40731/ladybug-drop-of-water-rain-leaf-40731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      phone,
      address,
      role: selectedRole,
      isBlock: selectedBlock,
    };
    console.log("userModifyData", userModifyData);
    // console.log("Product ID:", selectedProductId);
    // console.log("Product Data:", productModifyData);

    // console.log("Product ID:", selectedProductId);
    // console.log("Product Data:", productModifyData);

    try {
      await updateUser({
        userId: selectedUserId,
        userModifyData,
      });
      // console.log("Product updated:", response);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Successfully Updated Product info",
        showConfirmButton: false,
        timer: 1500,
      });

      setIsModalOpen(false);
      refetch();
    } catch {
      // console.error("Failed to update product:", error);
    }
  };
  const handleSelectChangeRole = (event: React.FormEvent) => {
    const form = event.target as HTMLFormElement;
    const selectedValue = form.value;
    setSelectedRole(selectedValue);
  };
  const handleSelectChangeIsBlock = (event: React.FormEvent) => {
    const form = event.target as HTMLFormElement;
    const selectedValue = form.value;
    setSelectedBlock(selectedValue);
  };
  const [deleteUser] = useDeleteUserMutation();
  const handleDeleteUser = async (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(userId).unwrap();
          Swal.fire("Deleted!", "Your product has been deleted.", "success");
          refetch();
        } catch (error) {
          console.error("Failed to delete product:", error);
          Swal.fire(
            "Error!",
            "There was an issue deleting the product.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="container mx-auto ">
      <div className="flex justify-between pt-5">
        <h2 className="text-4xl text-black font-semibold underline">
          User Management:
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex text-white btn btn-primary hover:bg-[#5B99C2] btn-md justify-between  "
        >
          <span>
            <IoAddCircleOutline className="w-6 h-7" />
          </span>
          <span>Add User</span>
        </button>
        {/* <dialog id="AddProductModal" className="modal  "> */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-400 text-black p-6 rounded-lg w-full max-w-lg">
              <form onSubmit={handleAddUser}>
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold">Add New User</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-black hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>
                <div className="my-4 text-black">
                  <label className="block mb-1">Name:</label>
                  <input
                    type="text"
                    name="nameT"
                    required
                    className="w-full p-2 border rounded bg-transparent text-black"
                    placeholder="Enter user name"
                  />
                </div>
                <div className="my-4">
                  <label className="block mb-1">Email:</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full p-2 border rounded bg-transparent text-black"
                    placeholder="Enter user email"
                  />
                </div>
                <div className="my-4">
                  <label className="block mb-1">Phone:</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full p-2 border rounded bg-transparent text-black"
                    placeholder="Enter user phone"
                  />
                </div>
                <div className="my-4">
                  <label className="block mb-1">Role:</label>
                  <select
                    onChange={handleSelectChangeRole}
                    value={selectedRole}
                    required
                    className="w-full p-2 border rounded bg-transparent text-black"
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    {roles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="my-4">
                  <label className="block mb-1">Is Blocked?</label>
                  <select
                    onChange={handleSelectChangeIsBlock}
                    value={selectedBlock}
                    required
                    className="w-full p-2 border rounded bg-transparent text-black"
                  >
                    <option value="" disabled>
                      Select Block Status
                    </option>
                    {isBlocks.map((block, index) => (
                      <option key={index} value={block}>
                        {block}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="my-4">
                  <label className="block mb-1">Address:</label>
                  <textarea
                    name="address"
                    required
                    className="w-full p-2 border rounded bg-transparent text-black"
                    placeholder="Enter user address"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save User
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* </dialog> */}

        {/* edit modal */}
        {/* edit modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#B7B7B7] text-black p-6 rounded-lg w-full max-w-lg">
              <form onSubmit={handleEditFormSubmit}>
                <div className="flex justify-between">
                  <div className="flex justify-center pt-5 ">
                    <h1 className="text-white text-3xl ">
                      {selectedUserId ? (
                        <p className="text-3xl text-black font-semibold text-center ">
                          Edit User
                        </p>
                      ) : (
                        <p className="text-3xl text-black font-semibold text-center ">
                          Add New User
                        </p>
                      )}
                    </h1>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-black hover:text-gray-900"
                  >
                    ✕
                  </button>
                </div>

                <p className="border border-1 border-gray-400 my-3 "></p>
                <div className="flex flex-col gap-2">
                  {selectedUserId && (
                    <div className="text-white text-center mb-4">
                      <p>User ID: {selectedUserId}</p>
                    </div>
                  )}
                  <div>
                    <label className="pr-14 text-black">Name:</label>
                    <input
                      type="text"
                      name="nameT"
                      defaultValue={selectedUser?.name}
                      placeholder="Enter user name"
                      className="input input-bordered input-primary w-full max-w-xs input-sm   bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="pr-14 text-black">Email:</label>
                    <input
                      type="text"
                      readOnly
                      defaultValue={selectedUser?.email}
                      name="email"
                      placeholder="Enter user email"
                      className="input input-bordered input-primary w-full max-w-xs input-sm  bg-white text-black"
                    />
                  </div>
                  {/* <div>
                  <label className="pr-3 text-white">Image(Optional):</label>
                  <input
                    type="text"
                    name="image"
                    defaultValue={selectedUser?.image}
                    placeholder="Enter image Link (Link only)"
                    className="input input-bordered input-primary w-full max-w-60 bg-inherit text-white"
                  />
                </div> */}
                  <div>
                    <label className="pr-12 text-black">Phone:</label>
                    <input
                      type="number"
                      defaultValue={selectedUser?.phone}
                      name="phone"
                      placeholder="Enter user phone number"
                      className="input input-bordered input-primary w-full max-w-xs input-sm   bg-white text-black"
                    />
                  </div>
                  <div>
                    <label className="pr-16 text-black">Role:</label>
                    <select
                      onChange={handleSelectChangeRole}
                      value={selectedRole || selectedUser?.role || ""}
                      className="select select-bordered w-full max-w-xs select-sm input-primary bg-white text-black"
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {roles.map((role, index) => (
                        <option key={index} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="pr-10 text-black">IsBlock?:</label>
                    <select
                      onChange={handleSelectChangeIsBlock}
                      value={selectedBlock || selectedUser?.isBlock || ""}
                      // defaultValue={selectedCar?.color}
                      className="select select-bordered w-full max-w-xs select-sm input-primary bg-white text-black"
                    >
                      <option value="" disabled>
                        Select Block Status
                      </option>
                      {isBlocks.map((color, index) => (
                        <option key={index} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-row align-middle">
                    <label className="pr-10  text-black">Address:</label>
                    <textarea
                      name="address"
                      defaultValue={selectedUser?.address}
                      className="textarea textarea-bordered w-full max-w-xs   input-primary bg-white text-black"
                      placeholder="address"
                    ></textarea>
                  </div>
                  <div className="flex justify-center my-5  ">
                    <button className="flex text-black btn hover:bg-[#1A4870] bg-[#5B99C2] btn-md justify-center w-full text-2xl pb-1 ">
                      Edit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* edit modal */}
        {/* edit modal */}
      </div>
      {/* table view */}
      <div className="container mx-auto overflow-x-auto pb-5 w-full max-w-4xl">
        <table className="table w-full ">
          {/* head */}
          <thead className="text-black text-lg">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>isBlock?</th>
              <th>Phone</th>
              <th>Address</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {users.length === 0 ? (
              <div>sorry</div>
            ) : (
              users.map((user: TUser) => (
                <>
                  <tr key={user._id} className="hover:bg-gray-300">
                    <td>
                      <div className="flex items-center gap-3 text-black ">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            {user.profileImage ? (
                              <>
                                <img
                                  src={user.profileImage}
                                  alt="Avatar Tailwind CSS Component"
                                  className="w-full h-full"
                                />
                              </>
                            ) : (
                              <>
                                <img
                                  // src={user.image}
                                  src="https://i.ibb.co/PrtzmM1/avator.png"
                                  alt="Avatar Tailwind CSS Component"
                                  className="w-full h-full"
                                />
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-black">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold text-black">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold text-black">
                          {user.role}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold text-black">
                          {user.isBlock}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold text-black">
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold text-black">
                          {user.address}
                        </div>
                      </div>
                    </td>
                    <th>
                      <div className="space-x-0">
                        <button
                          onClick={() => handleEditUser(user._id)}
                          className="btn btn-ghost btn-sm  text-black"
                        >
                          <GrTransaction className="w-6 h-6 " />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="btn btn-ghost btn-sm"
                        >
                          <MdDeleteForever className="w-6 h-6 text-red-700 " />
                        </button>
                      </div>
                    </th>
                  </tr>
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* table view */}
    </div>
  );
};

export default UserManagement;
