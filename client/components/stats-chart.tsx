"use client"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Pzt", connections: 120, authors: 45 },
  { name: "Sal", connections: 132, authors: 82 },
  { name: "Çar", connections: 101, authors: 56 },
  { name: "Per", connections: 134, authors: 78 },
  { name: "Cum", connections: 90, authors: 65 },
  { name: "Cmt", connections: 230, authors: 122 },
  { name: "Paz", connections: 210, authors: 98 },
]

export default function StatsChart() {
  return (
    <div className="w-full h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            className="dark:text-gray-400"
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            className="dark:text-gray-400"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              color: "var(--foreground)",
            }}
          />
          <Line type="monotone" dataKey="connections" stroke="#6366f1" strokeWidth={2} dot={false} name="Bağlantılar" />
          <Line type="monotone" dataKey="authors" stroke="#4f46e5" strokeWidth={2} dot={false} name="Yeni Yazarlar" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

