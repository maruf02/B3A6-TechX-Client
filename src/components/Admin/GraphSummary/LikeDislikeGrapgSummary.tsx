"use client";
import {
  useGetAllDisLikesMainQuery,
  useGetAllLikesMainQuery,
} from "@/Redux/api/baseApi";
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

interface Like {
  date: string;
  likes: number; // Assuming likes is a number
}

interface Dislike {
  date: string;
  dislikes: number; // Assuming dislikes is a number
}

const LikeDislikeGrapgSummary: React.FC = () => {
  const { data: likesData = [] } = useGetAllLikesMainQuery(undefined);
  const { data: dislikesData = [] } = useGetAllDisLikesMainQuery(undefined);

  // Combine likes and dislikes data by date
  const mergedData = likesData.map((like: Like) => {
    const dislike =
      dislikesData.find((d: Dislike) => d.date === like.date) || {};
    return {
      date: like.date,
      likes: like.likes || 0,
      dislikes: dislike.dislikes || 0,
    };
  });

  return (
    <div>
      <div>
        <h1 className="text-4xl text-center underline text-black pt-10">
          Upvote/Downvote Summary:
        </h1>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={mergedData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fill: "black", fontSize: 14 }} />
            <YAxis tick={{ fill: "black", fontSize: 14 }} />
            <Tooltip />
            <Legend verticalAlign="top" wrapperStyle={{ lineHeight: "40px" }} />
            <ReferenceLine y={0} stroke="#000" />
            <Brush dataKey="date" height={20} stroke="#8884d8" />
            <Bar dataKey="likes" fill="#82ca9d" name="Upvote" barSize={20} />
            <Bar
              dataKey="dislikes"
              fill="#ff6347"
              name="Downvote"
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LikeDislikeGrapgSummary;
