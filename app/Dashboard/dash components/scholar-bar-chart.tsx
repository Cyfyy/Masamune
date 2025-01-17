"use client"

import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Scholar {
  _id: string;
  name: string;
  axieId: string; // Added this field
  share: {
    manager: number;
    scholar: number;
  };
  winrate: number;
  slp: number;
  axs: number;
  totalSLP: number;
  totalMoonshard: number;
  rank: number;
  createdAt?: string; // Added this field
}

interface BattleLog {
  date: string;
  uuid: string;
  gameMode: string;
  startedAt: string;
  endedAt: string;
  winner: number;
  players: {
    userID: string;
    rank: string;
    tier: number;
    elo: number;
    vstar: number;
    team: {
      id: number;
      name: string;
      fighters: Array<{
        axieID: number;
        axieType: string;
        name?: string;
        position: number;
      }>;
      remainPercentTotalHp: number;
    };
    topRank?: number;
    totalCardPlayed: number;
  }[]; 
}

interface ScholarDetailsProps {
  scholar: Scholar;
  battleLogs: BattleLog[];
  onLoadMore: () => void;
  hasMoreLogs: boolean;
  isLoading: boolean;
}

const ScholarDetails: React.FC<ScholarDetailsProps> = ({ 
  scholar, 
  battleLogs, 
  onLoadMore, 
  hasMoreLogs, 
  isLoading 
}) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const getChartData = () => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    let data: { name: string; wins: number; losses: number }[] = [];

    if (timeframe === 'daily') {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      data = days.map(day => ({ name: day, wins: 0, losses: 0 }));

      battleLogs.forEach(log => {
        const logDate = new Date(log.startedAt);
        if (now.getTime() - logDate.getTime() <= 7 * oneDay) {
          const dayIndex = logDate.getDay();
          if (log.winner === 0) {
            data[dayIndex].wins++;
          } else {
            data[dayIndex].losses++;
          }
        }
      });
    } else if (timeframe === 'weekly') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data = weeks.map(week => ({ name: week, wins: 0, losses: 0 }));

      battleLogs.forEach(log => {
        const logDate = new Date(log.startedAt);
        const weekDiff = Math.floor((now.getTime() - logDate.getTime()) / oneWeek);
        if (weekDiff < 4) {
          if (log.winner === 0) {
            data[weekDiff].wins++;
          } else {
            data[weekDiff].losses++;
          }
        }
      });
    } else if (timeframe === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      data = months.map(month => ({ name: month, wins: 0, losses: 0 }));

      battleLogs.forEach(log => {
        const logDate = new Date(log.startedAt);
        if (now.getFullYear() === logDate.getFullYear()) {
          const monthIndex = logDate.getMonth();
          if (log.winner === 0) {
            data[monthIndex].wins++;
          } else {
            data[monthIndex].losses++;
          }
        }
      });
    }

    return data;
  };

  return (
    <div className="flex flex-col gap-8">
      <Card className="shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Scholar Overview</CardTitle>
          <CardDescription className="text-sm">Key statistics for {scholar.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium">Win Rate</p>
              <p className="text-2xl font-bold">{scholar.winrate}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total SLP</p>
              <p className="text-2xl font-bold">{scholar.totalSLP}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Moonshard</p>
              <p className="text-2xl font-bold">{scholar.totalMoonshard}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Manager/Scholar Split</p>
              <p className="text-2xl font-bold">{scholar.share.manager}/{scholar.share.scholar}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Performance Chart</CardTitle>
          <CardDescription className="text-sm">Wins and losses over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            {['daily', 'weekly', 'monthly'].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                onClick={() => setTimeframe(tf as 'daily' | 'weekly' | 'monthly')}
                className="px-4 py-2 text-sm"
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </Button>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="wins" fill="#4ade80" name="Wins" />
              <Bar dataKey="losses" fill="#f87171" name="Losses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-all bg-white dark:bg-gray-800 dark:text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Recent Battles</CardTitle>
          <CardDescription className="text-sm">Latest battle details</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="flex gap-4 mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="space-y-4">
                {battleLogs.map((log, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-lg transition-all dark:bg-gray-700">
                    <h3 className="font-semibold">{log.gameMode}</h3>
                    <p className="text-sm text-gray-500">{new Date(log.startedAt).toLocaleString()}</p>
                    <div className="flex justify-between mt-2">
                      <div>
                        <p className="text-sm">Player: {log.players[0].team.name}</p>
                        <p className={log.winner === 0 ? "text-green-600" : "text-red-600"}>
                          {log.winner === 0 ? "Winner" : "Loser"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm">Opponent: {log.players[1].team.name}</p>
                        <p className={log.winner === 1 ? "text-green-600" : "text-red-600"}>
                          {log.winner === 1 ? "Winner" : "Loser"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="detailed">
              <div className="space-y-8">
                {battleLogs.map((log, index) => (
                  <Card key={index} className="shadow-lg hover:shadow-xl transition-all dark:bg-gray-700">
                    <CardHeader>
                      <CardTitle>{log.gameMode} Battle</CardTitle>
                      <CardDescription>{new Date(log.startedAt).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {log.players.map((player, playerIndex) => (
                          <div key={playerIndex} className={`p-4 rounded-lg ${log.winner === playerIndex ? 'bg-green-100' : 'bg-red-100'}`}>
                            <h4 className="font-bold mb-2">{player.team.name}</h4>
                            <p className="text-sm">Rank: {player.rank}</p>
                            <p className="text-sm">Total Cards Played: {player.totalCardPlayed}</p>
                            <h5 className="font-semibold mt-2">Team:</h5>
                            <ul className="list-disc list-inside text-sm">
                              {player.team.fighters.map((fighter, fighterIndex) => (
                                <li key={fighterIndex}>
                                  {fighter.name || `Axie #${fighter.axieID}`}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          {hasMoreLogs && (
            <Button onClick={onLoadMore} disabled={isLoading} className="mt-4 w-full">
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScholarDetails;

