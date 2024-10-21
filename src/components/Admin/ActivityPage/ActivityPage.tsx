import { useGetLoginActivitiesQuery } from "@/Redux/api/baseApi";
import { TloginActivity } from "@/types";

const ActivityPage = () => {
  const {
    data: loginActivities,
    error,
    isLoading,
  } = useGetLoginActivitiesQuery(undefined);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading login activities</div>;
  }

  // Render the login activities in a table
  return (
    // <div>
    //   <h1>Login Activities</h1>
    //   <table>
    //     <thead>
    //       <tr>
    //         <th>Email</th>
    //         <th>Login Time</th>
    //         <th>Device</th>
    //       </tr>
    //     </thead>
    //     <tbody>
    //       {loginActivities?.map((activity: TloginActivity) => (
    //         <tr key={activity._id}>
    //           <td>{activity.email}</td>
    //           <td>{activity.loginAt}</td>
    //           <td>{activity.device}</td>
    //         </tr>
    //       ))}
    //     </tbody>
    //   </table>
    // </div>
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6 text-black">
        Login History
      </h1>
      <table className="min-w-full border border-gray-300">
        <thead className="text-xl bg-[#B7B7B7] text-black">
          <tr>
            <th>Email</th>
            <th>Login Time</th>
            <th>Device</th>
          </tr>
        </thead>
        <tbody>
          {loginActivities.map((activity: TloginActivity) => (
            <tr
              key={activity._id}
              className="border-b text-black hover:bg-gray-100 text-lg"
            >
              <td className="border px-4 py-2">{activity.email}</td>
              <td className="border px-4 py-2">{activity.loginAt}</td>
              <td className="border px-4 py-2">{activity.device}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityPage;
