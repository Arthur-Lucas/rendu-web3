"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AA00FF"];

export default function PieChartResults({ results }) {
  const data = results.map((res) => ({
    name: res.nom,
    value: parseInt(res.votes),
  }));

  return (
    <div className="flex justify-center">
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
