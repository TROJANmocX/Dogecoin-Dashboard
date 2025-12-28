"use client"

import type React from "react"
import { ComposedChart, XAxis, YAxis, ResponsiveContainer, Bar, ReferenceLine, Tooltip, CartesianGrid } from "recharts"

interface CandlestickData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface AdvancedCandlestickProps {
  data: CandlestickData[]
  height?: number
}

const CustomCandlestick = (props: any) => {
  const { payload, x, y, width, height } = props

  if (!payload || !payload.candlestickData) return null

  const { open, high, low, close } = payload.candlestickData
  const isPositive = close >= open
  const color = isPositive ? "#10b981" : "#ef4444"

  // Calculate the scale
  const priceRange = high - low
  if (priceRange === 0) return null

  const scale = height / priceRange
  const centerX = x + width / 2

  // Calculate positions
  const highY = y
  const lowY = y + height
  const openY = y + (high - open) * scale
  const closeY = y + (high - close) * scale

  const bodyTop = Math.min(openY, closeY)
  const bodyHeight = Math.abs(closeY - openY)

  return (
    <g>
      {/* High-Low line */}
      <line x1={centerX} y1={highY} x2={centerX} y2={lowY} stroke={color} strokeWidth={1} opacity={0.8} />

      {/* Body */}
      <rect
        x={x + width * 0.25}
        y={bodyTop}
        width={width * 0.5}
        height={Math.max(bodyHeight, 1)}
        fill={isPositive ? "transparent" : color}
        stroke={color}
        strokeWidth={2}
        opacity={isPositive ? (payload.isFuture ? 1 : 0.4) : (payload.isFuture ? 1 : 0.6)}
      />
    </g>
  )
}

export const AdvancedCandlestick: React.FC<AdvancedCandlestickProps> = ({ data, height = 350 }) => {
  // Transform data for the chart
  const chartData = data.map((item, index) => ({
    ...item,
    candlestickData: {
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    },
    // Use high value for positioning
    // Use high value for positioning
    value: item.high,
    isFuture: index >= data.length - 5 // assume last 5 points are prediction/future
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          className="text-xs"
        />
        <YAxis
          domain={["dataMin", "dataMax"]}
          tickFormatter={(value) => `$${value.toFixed(4)}`}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          className="text-xs"
        />
        <Tooltip
          cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3' }}
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white/95 backdrop-blur p-2 border border-indigo-100 shadow-xl rounded-lg text-xs">
                  <p className="font-bold text-gray-700 mb-1">{new Date(data.date).toLocaleDateString()}</p>
                  <div className="space-y-1 font-mono">
                    <p className="text-gray-500">O: <span className="text-gray-900">{data.open.toFixed(4)}</span></p>
                    <p className="text-gray-500">C: <span className={data.close >= data.open ? "text-green-600" : "text-red-600"}>{data.close.toFixed(4)}</span></p>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" shape={<CustomCandlestick />} fill="transparent" />
        <ReferenceLine x={chartData[chartData.length - 2]?.date} stroke="#6366f1" strokeDasharray="3 3" label={{ value: "NOW", position: 'top', fill: '#6366f1', fontSize: 10, fontWeight: 'bold' }} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
