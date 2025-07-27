"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

interface VolumeData {
  volume: number
  date: string
  close: number
  open: number
}

interface VolumeIndicatorsProps {
  data: VolumeData[]
}

export const VolumeIndicators: React.FC<VolumeIndicatorsProps> = ({ data }) => {
  if (!data || data.length === 0) return null

  // Calculate volume metrics
  const totalVolume = data.reduce((sum, item) => sum + item.volume, 0)
  const avgVolume = totalVolume / data.length
  const latestVolume = data[data.length - 1]?.volume || 0
  const volumeChange = ((latestVolume - avgVolume) / avgVolume) * 100

  // Calculate volume-price correlation
  const volumeWeightedPrice =
    data.reduce((sum, item) => {
      return sum + item.close * item.volume
    }, 0) / totalVolume

  // Volume trend analysis
  const recentVolume = data.slice(-3).reduce((sum, item) => sum + item.volume, 0) / 3
  const olderVolume = data.slice(-7, -3).reduce((sum, item) => sum + item.volume, 0) / 4
  const volumeTrend = recentVolume > olderVolume ? "increasing" : "decreasing"

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <Card className="bg-[#1E1E1E] border border-[#3A3A3A]/50 hover:border-[#00FFAE]/30 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[#3A3A3A] flex items-center">
            <Activity className="h-4 w-4 mr-2 text-[#00FFAE]" />
            Volume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-[#EAEAEA] font-mono">{(latestVolume / 1000000).toFixed(1)}M</div>
          <div className="flex items-center space-x-2 mt-1">
            <Badge
              className={`text-xs border ${
                volumeChange > 0
                  ? "bg-[#00FFAE]/10 text-[#00FFAE] border-[#00FFAE]/30"
                  : "bg-[#FF9F1C]/10 text-[#FF9F1C] border-[#FF9F1C]/30"
              }`}
            >
              {volumeChange > 0 ? "+" : ""}
              {volumeChange.toFixed(1)}%
            </Badge>
            <span className="text-xs text-[#3A3A3A]">vs avg</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1E1E1E] border border-[#3A3A3A]/50 hover:border-[#FF9F1C]/30 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[#3A3A3A]">Volume Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {volumeTrend === "increasing" ? (
              <TrendingUp className="h-5 w-5 text-[#00FFAE]" />
            ) : (
              <TrendingDown className="h-5 w-5 text-[#FF9F1C]" />
            )}
            <span className="text-lg font-semibold text-[#EAEAEA] capitalize font-mono">{volumeTrend}</span>
          </div>
          <p className="text-xs text-[#3A3A3A] mt-1">3-day vs 4-day average</p>
        </CardContent>
      </Card>

      <Card className="bg-[#1E1E1E] border border-[#3A3A3A]/50 hover:border-[#3A3A3A]/50 transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[#3A3A3A]">VWAP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold text-[#EAEAEA] font-mono">${volumeWeightedPrice.toFixed(4)}</div>
          <p className="text-xs text-[#3A3A3A] mt-1">Volume Weighted Avg Price</p>
        </CardContent>
      </Card>
    </div>
  )
}
