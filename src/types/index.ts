export type TLoginUser = {
  email: string;
  password: string;
  _id: string;
  role: string;
  name: string;
};

export type TUser = {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  coverImage?: string;
  role?: "user" | "admin";
  isBlock?: "Yes" | "No";
  isDeleted?: boolean;
  password: string;
  phone: string;
  address: string;
  follower?: string[];
  following?: string[];
  followerP?: string[];
  followingP?: string[];
};

export type TComment = {
  _id: string;
  userId: string;
  userIdP: TUser;
  name: string;
  postId: string;
  comment: string;
  isDeleted?: boolean;
};

export type TFollow = {
  userId: string;
  followers: string[];
  following: string[];
};

export type TPayment = {
  _id: string;
  name: string;
  userIdP: TUser;
  userId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId: string;
  date: string;
  startTime: string;
  endTime: string;
};

export type TPost = {
  _id: string;
  userId: string;
  userIdP: TUser;
  user: string;
  name: string;
  post: string;
  category: "Web" | "Software" | "Engineering" | "AI";
  type: "Free" | "Premium";
  images: string;
  likes: string[];
  dislikes: string[];
  views: string[];
  isDeleted?: boolean;
};

export type TDecodedToken = {
  _id: string;
  name: string;
};

export type TloginActivity = {
  _id: string;
  email: string;
  loginAt: string;
  device: string;
};
