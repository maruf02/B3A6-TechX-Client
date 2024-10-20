"use client";
import AllGraphSummary from "./AllGraphSummary";
import LikeDislikeGrapgSummary from "./LikeDislikeGrapgSummary";
import OverviewSummary from "./OverviewSummary";
import ViewGraphSummary from "./ViewGraphSummary";

export const GraphSummary: React.FC = () => {
  return (
    <div>
      <OverviewSummary />
      <AllGraphSummary />
      <ViewGraphSummary />
      <LikeDislikeGrapgSummary />
    </div>
  );
};
