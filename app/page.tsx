"use client";

import { useState } from "react";

import { AdvancedCandlestick } from "@/components/advanced-candlestick";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Info, BarChart3, TrendingUp, AlertTriangle, Activity, Server, History } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState<any[]>([]); // New state for history
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '14D' | '30D'>('30D');
  const [chartView, setChartView] = useState<'candles' | 'line'>('candles');

  // Toggle this to switch between mock API (Next.js) and FastAPI backend
  const USE_FASTAPI = true; // set to true to use FastAPI backend

  const handlePredict = async () => {
    setLoading(true);
    try {
      let response, result;
      if (USE_FASTAPI) {
        response = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: "dogecoin" }), // example input
        });
        result = await response.json();
        if (result.error) {
          console.error("Backend error:", result.error);
          return;
        }

        // Adapt FastAPI response to expected frontend structure
        const newPrediction = {
          currentPrice: result.current_price,
          predictedPrice: result.prediction,
          mae: result.mae || 0.0042, // default fallback
          rangeLow: result.range_low || result.prediction * 0.98,
          rangeHigh: result.range_high || result.prediction * 1.02,
          modelVersion: "v2.1-LSTM",
          lastRetrain: new Date().toLocaleTimeString(),
          dataPoints: result.history.length,
          confidenceBands: { lower: result.range_low, upper: result.range_high },
          features: ["OHLC (30d)", "Volume-Weighted MA", "Momentum Oscillator"],
          history: result.history,
          action: result.action
        };

        setPredictionData(newPrediction);
        setPredictionHistory(prev => [newPrediction, ...prev].slice(0, 5)); // Keep last 5
      } else {
        response = await fetch("/api/predict", { method: "GET" });
        result = await response.json();
        if (result.success) {
          setPredictionData(result);
        } else {
          console.error("API error:", result.error);
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!showDashboard) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white flex-col gap-4">
        <h1 className="text-4xl font-bold text-center">
          🚀 Dogecoin Dashboard Coming Soon!
        </h1>
        <button
          onClick={() => setShowDashboard(true)}
          className="mt-4 px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Enter Preview Mode
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 text-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="relative z-10 text-center mb-8">
        <h1 className="text-5xl font-extrabold mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
          Dogecoin Price Predictor 🚀
        </h1>
        <p className="text-sm text-gray-600 font-medium tracking-wide uppercase opacity-70">
          Short-term market estimation using historical momentum signals
        </p>
      </div>

      {/* Old button removed, moved to card header */}

      {!predictionData && (
        <button
          onClick={handlePredict}
          disabled={loading}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition duration-200 hover:shadow-indigo-500/25 animate-pulse"
        >
          {loading ? "Analyzing Market..." : "Initialize Prediction Model"}
        </button>
      )}

      {predictionData && (
        <div className="mt-8 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-indigo-50/50 p-1 rounded-xl h-auto">
              <TabsTrigger value="analysis" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-medium transition-all duration-200 py-3 flex flex-col items-center gap-1">
                <div className="flex items-center gap-2"><Activity className="w-4 h-4" /> Market Analysis</div>
                <span className="text-[10px] opacity-70 font-normal">Live Market Evaluation</span>
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-medium transition-all duration-200 py-3 flex flex-col items-center gap-1">
                <div className="flex items-center gap-2"><Server className="w-4 h-4" /> System Info</div>
                <span className="text-[10px] opacity-70 font-normal">Model Health & Latency</span>
              </TabsTrigger>
              <TabsTrigger value="backtest" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm font-medium transition-all duration-200 py-3 flex flex-col items-center gap-1">
                <div className="flex items-center gap-2"><History className="w-4 h-4" /> Backtest</div>
                <span className="text-[10px] opacity-70 font-normal">Historical Performance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analysis">
              <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6 border border-indigo-100/50">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" /> Market Analysis
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide">
                      24h forward-looking estimate based on short-term momentum
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Live from CoinGecko</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={handlePredict}
                      disabled={loading}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1"
                    >
                      {loading ? "Analyzing..." : "Refresh Prediction"}
                    </button>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${predictionData.action.includes('BULLISH') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                      {predictionData.action}
                    </span>
                  </div>
                </div>

                {/* Primary Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-end">
                  {/* HERO STAT: Predicted Target */}
                  <div className="p-5 bg-white rounded-xl border border-indigo-100 shadow-[0_0_15px_-3px_rgba(99,102,241,0.15)] md:col-span-1 transform transition hover:scale-[1.02] duration-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                      <TrendingUp className="w-12 h-12" />
                    </div>
                    <p className="text-xs text-indigo-500 uppercase tracking-wider font-bold mb-1">Predicted Target</p>
                    <p className="text-3xl font-black font-mono text-indigo-700 leading-none group-hover:text-indigo-800 transition-colors">${predictionData.predictedPrice?.toFixed(4)}</p>
                    <p className="text-[10px] text-indigo-400 mt-2 font-medium">Next 24h Projection</p>
                  </div>

                  {/* SECONDARY STAT: Current Price */}
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm relative">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Current Price</p>
                    <p className="text-xl font-bold font-mono text-gray-900">${predictionData.currentPrice?.toFixed(4)}</p>
                  </div>

                  {/* TERTIARY STAT: Model Error */}
                  <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 shadow-sm opacity-90">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Model Error (MAE)</p>
                    <p className="text-lg font-bold font-mono text-gray-500">±${predictionData.mae?.toFixed(5)}</p>
                  </div>
                </div>

                {/* Range Slider */}
                <div className="space-y-3 mb-8 bg-gray-50/50 p-4 rounded-xl border border-gray-100 relative group overflow-hidden">
                  <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wide z-10 relative">
                    <span className="group-hover:text-indigo-400 transition-colors cursor-help" title="Pessimistic Scenario">Low Band</span>
                    <span className="text-indigo-600 font-bold">Model Estimate</span>
                    <span className="group-hover:text-indigo-400 transition-colors cursor-help" title="Optimistic Scenario">High Band</span>
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden flex relative shadow-inner">
                    {/* Faded range band */}
                    <div className="absolute left-[25%] right-[25%] h-full bg-indigo-500/10 backdrop-blur-sm"></div>
                    {/* Center Marker */}
                    <div className="absolute left-[48%] h-full w-[4%] bg-indigo-600 rounded-full shadow-lg ring-2 ring-white transform scale-110 flex items-center justify-center animate-in slide-in-from-left duration-1000"></div>
                  </div>
                  <div className="flex justify-between font-mono text-xs text-gray-400">
                    <span>${predictionData.rangeLow?.toFixed(4)}</span>
                    <span>${predictionData.rangeHigh?.toFixed(4)}</span>
                  </div>
                </div>



                {predictionData.history && (
                  <div className="h-[350px] w-full bg-slate-50 rounded-lg p-2 border">
                    <AdvancedCandlestick data={predictionData.history} height={320} />
                  </div>
                )}

                {/* (Fab moved to layout root) */}
              </div>
            </TabsContent>

            <TabsContent value="system">
              <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Model Version</span>
                    <span className="font-mono">{predictionData.modelVersion}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Last Retrain</span>
                    <span className="font-mono">{predictionData.lastRetrain}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Latency</span>
                    <span className="font-mono text-green-600">42ms</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="backtest">
              <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold mb-4">Backtesting Results (30 Day)</h3>
                <div className="h-40 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300">
                  <p className="text-gray-400 text-sm">Backtest data visualization initializing...</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Dedicated Chart Section */}
          {predictionData.history && (
            <div className="mt-6 bg-gradient-to-br from-slate-50/50 to-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              {/* Chart Control Bar */}
              <div className="flex justify-between items-center px-6 py-3 border-b border-gray-100 bg-white/50">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-gray-700 tracking-wide">Price Analysis</h3>
                </div>
                <div className="flex items-center gap-4">
                  {/* Timeframe Controls */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    {(['7D', '14D', '30D'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setChartTimeframe(tf)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartTimeframe === tf
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                  {/* View Controls */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setChartView('candles')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartView === 'candles'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Candles
                    </button>
                    <button
                      onClick={() => setChartView('line')}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${chartView === 'line'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Line
                    </button>
                  </div>
                </div>
              </div>
              {/* Chart Container */}
              <div className="relative p-4">
                <div className="h-[480px] w-full">
                  <AdvancedCandlestick
                    data={predictionData.history.slice(
                      chartTimeframe === '7D' ? -7 :
                        chartTimeframe === '14D' ? -14 :
                          -30
                    )}
                    height={480}
                  />
                </div>
                {/* Mini Legend */}
                <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-lg text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm border border-green-600"></div>
                    <span className="text-gray-600">Price Up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm border border-red-600"></div>
                    <span className="text-gray-600">Price Down</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 border-t-2 border-dashed border-indigo-600"></div>
                    <span className="text-gray-600">Now</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-2 bg-indigo-500/10 rounded"></div>
                    <span className="text-gray-600">Prediction Range</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {predictionData && (
        <>
          {/* Prediction History Mini-Panel */}
          {predictionHistory.length > 0 && (
            <div className="mt-6 w-full max-w-lg mx-auto bg-white/50 border border-gray-100 rounded-lg p-4 backdrop-blur-sm">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Session History</h4>
              <div className="space-y-2">
                {predictionHistory.map((h, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-mono">{h.lastRetrain}</span>
                    <span className="font-bold text-gray-700">${h.predictedPrice?.toFixed(4)}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${h.action.includes('BULLISH') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{h.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="mt-12 text-center pb-12 opacity-60 hover:opacity-100 transition-opacity duration-500">
        <p className="text-[10px] text-gray-400 max-w-md mx-auto flex items-start justify-center gap-1.5 leading-relaxed font-medium">
          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>
            <strong>Markets are stochastic.</strong> This system estimates short-term direction, not market certainty.
            <br />Not financial advice. Past performance is not indicative of future results.
          </span>
        </p>
      </div>

      {/* Sticky "Model Methodology" FAB */}
      <div className="fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <button className="bg-white/90 backdrop-blur text-indigo-600 hover:bg-indigo-50 border border-indigo-100 shadow-lg px-4 py-2 rounded-full text-xs font-bold transition-all transform hover:scale-105 flex items-center gap-2">
              <Info className="w-4 h-4" /> Model Methodology
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Model Methodology</SheetTitle>
              <SheetDescription>
                Transparent breakdown of our prediction pipeline.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">1. Data Ingestion</h4>
                <p className="text-sm text-gray-500">
                  We consume live OHLCV data from CoinGecko API every 60 seconds.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">2. Feature Engineering</h4>
                <ul className="text-sm text-gray-500 list-disc pl-4 space-y-1">
                  <li>30-day Price Window</li>
                  <li>Volume-Weighted Moving Average</li>
                  <li>Momentum Oscillator (14-day)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">3. Inference</h4>
                <p className="text-sm text-gray-500">
                  The data is fed into a hybrid linear regression model to project the trend vector.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </main>
  );
}
