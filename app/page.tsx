"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);

  // Toggle this to switch between mock API (Next.js) and FastAPI backend
  const USE_FASTAPI = false; // set to true to use FastAPI backend

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
        // Adapt FastAPI response to expected frontend structure
        setPredictionData({
          currentPrice: 0.0832, // placeholder
          predictedPrice: result.prediction,
          confidence: 0.92,
          accuracy: 0.95,
          modelVersion: "v1.0.0",
          lastRetrain: "N/A",
          dataPoints: 10000,
          confidenceBands: { lower: result.prediction * 0.95, upper: result.prediction * 1.05 },
          features: ["input_length"],
        });
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-indigo-800">
        Dogecoin Price Predictor 🚀
      </h1>

      <button
        onClick={handlePredict}
        disabled={loading}
        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
      >
        {loading ? "Predicting..." : "Predict Now"}
      </button>

      {predictionData && (
        <div className="mt-8 bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl space-y-3 border border-gray-200">
          <h2 className="text-xl font-semibold text-green-600">📊 Prediction Details</h2>
          <p><strong>Current Price:</strong> ${predictionData.currentPrice}</p>
          <p><strong>Predicted Price:</strong> ${predictionData.predictedPrice}</p>
          <p><strong>Confidence:</strong> {(predictionData.confidence * 100).toFixed(1)}%</p>
          <p><strong>Accuracy:</strong> {(predictionData.accuracy * 100).toFixed(1)}%</p>
          <p><strong>Model Version:</strong> {predictionData.modelVersion}</p>
          <p><strong>Last Retrain:</strong> {predictionData.lastRetrain}</p>
          <p><strong>Data Points:</strong> {predictionData.dataPoints}</p>
          <p><strong>Confidence Band:</strong> ${predictionData.confidenceBands.lower} - ${predictionData.confidenceBands.upper}</p>
          <p><strong>Features Used:</strong> {predictionData.features.join(", ")}</p>
        </div>
      )}
    </main>
  );
}
