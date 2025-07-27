"use client"

import type React from "react"
import { ComposedChart, XAxis, YAxis, ResponsiveContainer, Bar } from "recharts"

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
        opacity={isPositive ? 0.8 : 1}
      />
    </g>
  )
}

export const AdvancedCandlestick: React.FC<AdvancedCandlestickProps> = ({ data, height = 350 }) => {
  // Transform data for the chart
  const chartData = data.map((item) => ({
    ...item,
    candlestickData: {
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    },
    // Use high value for positioning
    value: item.high,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis
          dataKey="date"
          tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          axisLine={false}
          tickLine={false}
          className="text-xs"
        />
        <YAxis
          domain={["dataMin", "dataMax"]}
          tickFormatter={(value) => `$${value.toFixed(4)}`}
          axisLine={false}
          tickLine={false}
          className="text-xs"
        />
        <Bar dataKey="value" shape={<CustomCandlestick />} fill="transparent" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
