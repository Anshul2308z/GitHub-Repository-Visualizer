"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { timelineData } from "@/lib/mock-data"

export function TimelineChart({ data }: { data: any[] }) {
    return (
    <Card className="col-span-2 bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Commit Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#4B5563" }}
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#4B5563" }}
                tick={{ fill: "#9CA3AF" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                labelStyle={{ color: "#F9FAFB" }}
                itemStyle={{ color: "#60A5FA" }}
              />
              <Line
                type="monotone"
                dataKey="commits"
                stroke="#60A5FA"
                strokeWidth={3}
                dot={{ fill: "#60A5FA", strokeWidth: 2, stroke: "#1F2937", r: 5 }}
                activeDot={{ r: 7, fill: "#93C5FD", stroke: "#60A5FA", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
