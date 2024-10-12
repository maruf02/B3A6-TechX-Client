"use client";
import {
  BarChart,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import {
  useGetAllCommentsQuery,
  useGetAllPostsMainQuery,
} from "@/Redux/api/baseApi";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlock: string;
  isDeleted: boolean;
  profileImage: string;
  coverImage: string;
  phone: string;
  address: string;
  follower: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
  followerP: string[];
  followingP: string[];
}

interface Post {
  _id: string;
  userIdP: User;
  userId: string;
  name: string;
  post: string;
  category: string;
  type: string;
  images: string;
  likes: string[];
  dislikes: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Comment {
  _id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface GraphData {
  date: string;
  posts: number;
  comments: number;
  likes: number;
  dislikes: number;
}

export const GraphSummary: React.FC = () => {
  const { data: posts = [], isLoading: postsLoading } =
    useGetAllPostsMainQuery(undefined);
  const { data: comments = [], isLoading: commentsLoading } =
    useGetAllCommentsQuery(undefined);

  const [graphData, setGraphData] = useState<GraphData[]>([]);

  useEffect(() => {
    if (!postsLoading && !commentsLoading) {
      const processedData = processGraphData(posts, comments);
      setGraphData(processedData);
    }
  }, [posts, comments, postsLoading, commentsLoading]);

  const processGraphData = (
    posts: Post[],
    comments: Comment[]
  ): GraphData[] => {
    const summary: { [key: string]: GraphData } = {};

    posts.forEach((post) => {
      const date = new Date(post.createdAt).toLocaleDateString();
      if (!summary[date]) {
        summary[date] = { date, posts: 0, comments: 0, likes: 0, dislikes: 0 };
      }
      summary[date].posts += 1;
      summary[date].likes += post.likes.length;
      summary[date].dislikes += post.dislikes.length;
    });

    comments.forEach((comment) => {
      const date = new Date(comment.createdAt).toLocaleDateString();
      if (!summary[date]) {
        summary[date] = { date, posts: 0, comments: 0, likes: 0, dislikes: 0 };
      }
      summary[date].comments += 1;
    });

    return Object.keys(summary).map((date) => summary[date]);
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl text-center underline">Graph Summary:</h1>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={graphData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
            <ReferenceLine y={0} stroke="#000" />
            <Brush dataKey="date" height={20} stroke="#8884d8" />
            <Bar dataKey="posts" fill="#8884d8" name="Posts" barSize={10} />
            <Bar
              dataKey="comments"
              fill="#82ca9d"
              name="Comments"
              barSize={10}
            />
            <Bar dataKey="likes" fill="#ffc658" name="Likes" barSize={10} />
            <Bar
              dataKey="dislikes"
              fill="#ff7300"
              name="Dislikes"
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
