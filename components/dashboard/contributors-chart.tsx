"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { contributorsData } from "@/lib/mock-data"

export function ContributorsChart({data}: {data: any[]}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Top Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} horizontal={false} />
              <XAxis
                type="number"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#4B5563" }}
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: "#4B5563" }}
                tick={{ fill: "#9CA3AF" }}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                labelStyle={{ color: "#F9FAFB" }}
                itemStyle={{ color: "#34D399" }}
                cursor={{ fill: "#374151", opacity: 0.3 }}
              />
              <Bar
                dataKey="commits"
                fill="#34D399"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
