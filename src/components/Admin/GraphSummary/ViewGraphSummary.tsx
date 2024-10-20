"use client";

import { useGetAllViewMainQuery } from "@/Redux/api/baseApi";

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

const ViewGraphSummary: React.FC = () => {
  const { data: AllView = [] } = useGetAllViewMainQuery(undefined);

  return (
    <div>
      <div>
        <h1 className="text-2xl text-center underline">Graph Summary:</h1>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={AllView}
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
            <Bar dataKey="views" fill="#8884d8" name="Views" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ViewGraphSummary;
