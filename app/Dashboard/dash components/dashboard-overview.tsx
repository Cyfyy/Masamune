import { Card, CardContent, CardHeader, CardTitle } from "@/app/Dashboard/dash components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export function DashboardOverview() {
  const [activeScholars, setActiveScholars] = useState<number>(0);
  const [newScholars, setNewScholars] = useState<number>(0);
  const [deletedScholars, setDeletedScholars] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchScholars = async () => {
      try {
        const response = await axios.get("/api/scholars");
        const scholars = response.data;

        setActiveScholars(scholars.filter((scholar: any) => !scholar.deleted).length);

        const currentDate = new Date();
        const newScholarsCount = scholars.filter((scholar: any) => {
          const createdAt = new Date(scholar.createdAt);
          const diffInHours = (currentDate.getTime() - createdAt.getTime()) / (1000 * 3600);
          return diffInHours <= 24;
        }).length;
        setNewScholars(newScholarsCount);

        const deletedScholarsCount = scholars.filter((scholar: any) => scholar.deleted).length;
        setDeletedScholars(deletedScholarsCount);

      } catch (error) {
        console.error("Error fetching scholars:", error);
      }
    };

    // Fetch season leaderboard data from the API
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("/api/season-leaderboard");
        setLeaderboard(response.data._items); // Set the fetched leaderboard data
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchScholars();
    fetchLeaderboard(); // Call the function to fetch leaderboard data
  }, []);

  const scholarData = [
    { name: "New Scholars", value: newScholars, color: "#FF6384" },
    { name: "Deleted Scholars", value: deletedScholars, color: "#36A2EB" },
    { name: "Active Scholars", value: activeScholars, color: "#FFCE56" },
  ];

  // Sort the leaderboard by topRank (assuming topRank is available in the data)
  const sortedLeaderboard = leaderboard.sort((a, b) => a.topRank - b.topRank);

  return (
    <div className="p-8 space-y-8">
      {/* Scholar Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarData.map((item, index) => (
          <Card key={index} className="bg-gradient-to-r from-gray-50 to-gray-200 shadow-xl">
            <CardHeader className="flex flex-col items-center space-y-4 py-6">
              <CardTitle className="text-lg font-semibold text-gray-700">{item.name}</CardTitle>
              <div className="text-3xl font-bold text-gray-900">{item.value}</div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Scholar Distribution Card */}
      <Card className="bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Scholar Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={scholarData.slice(0, 2)} // Only New Scholars and Deleted Scholars
                cx="50%"
                cy="50%"
                className="text-[14px]"
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {scholarData.slice(0, 2).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Season Leaderboard Card */}
      <Card className="bg-white shadow-xl mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Season Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedLeaderboard.length > 0 ? (
            sortedLeaderboard.map((player, index) => (
              <div key={index} className="flex items-center justify-between py-4 border-b border-gray-200">
                <div className="text-gray-900 font-bold">{`Rank: ${index + 1}`}</div> {/* Display rank */}
                <div className="text-gray-700 font-medium">{player.name}</div> {/* Display name */}
                <div className="text-gray-900 font-bold">{`${player.vstar} pts`}</div> {/* Display vstar points */}
              </div>
            ))
          ) : (
            <div>Loading leaderboard...</div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}
