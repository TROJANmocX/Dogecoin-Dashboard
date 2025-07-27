import type React from "react"

interface CandlestickBarProps {
  payload?: {
    open: number
    high: number
    low: number
    close: number
  }
  x?: number
  y?: number
  width?: number
  height?: number
}

export const CandlestickBar: React.FC<CandlestickBarProps> = ({ payload, x = 0, y = 0, width = 0, height = 0 }) => {
  if (!payload) return null

  const { open, high, low, close } = payload
  const isPositive = close >= open
  const color = isPositive ? "#10b981" : "#ef4444" // green for up, red for down

  // Calculate positions
  const centerX = x + width / 2
  const bodyTop = Math.min(open, close)
  const bodyBottom = Math.max(open, close)
  const bodyHeight = Math.abs(close - open)

  // Scale factors (these would normally come from the chart's scale)
  const priceRange = high - low
  const pixelPerPrice = height / priceRange

  const highY = y + (high - Math.max(open, close)) * pixelPerPrice
  const lowY = y + height - (Math.min(open, close) - low) * pixelPerPrice
  const bodyY = y + (high - Math.max(open, close)) * pixelPerPrice
  const bodyPixelHeight = bodyHeight * pixelPerPrice

  return (
    <g>
      {/* High-Low line (wick) */}
      <line x1={centerX} y1={highY} x2={centerX} y2={lowY} stroke={color} strokeWidth={1} />

      {/* Body rectangle */}
      <rect
        x={x + width * 0.2}
        y={bodyY}
        width={width * 0.6}
        height={Math.max(bodyPixelHeight, 1)} // Minimum height of 1px for doji candles
        fill={isPositive ? color : color}
        fillOpacity={isPositive ? 0.8 : 1}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  )
}
