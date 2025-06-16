"use client";

import React, { useState } from "react";
import { PlannerAgent, SpaceXAgent, WeatherAgent, SummaryAgent } from "@/lib/agents";

export default function HomePage() {
  const [goal, setGoal] = useState("");
  interface ResultData {
    summary: string;
    launch: any;
    weather: any;
  }

  const [result, setResult] = React.useState<ResultData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openWeatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";

  const runAgents = async (userGoal: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const planner = new PlannerAgent();
      const spaceXAgent = new SpaceXAgent();
      const weatherAgent = new WeatherAgent();
      const summaryAgent = new SummaryAgent();

      // Planner creates plan steps (not used in this demo but could be extended)
      const plan = await planner.execute(userGoal);

      // Run SpaceX agent
      const spaceXData = await spaceXAgent.execute(null);

      // Run Weather agent with SpaceX data
      const weatherData = await weatherAgent.execute(spaceXData);

      // Run Summary agent with weather and launch data
      const summaryText = await summaryAgent.execute(weatherData);

      setResult({
        summary: summaryText,
        launch: weatherData.launch,
        weather: weatherData.weather,
      });
    } catch (err: any) {
      setError(err.message || "Error running agents");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() === "") {
      setError("Please enter a goal");
      return;
    }
    runAgents(goal);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Multi-Agent AI System</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <label htmlFor="goal" className="block mb-2 text-lg font-semibold">
          Enter your goal:
        </label>
        <input
          id="goal"
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-3 rounded border border-gray-600 bg-gray-900 text-white mb-4"
          placeholder="e.g. Find the next SpaceX launch, check weather, summarize delay"
        />
        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 transition"
          disabled={loading}
        >
          {loading ? "Processing..." : "Run Agents"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {result && (
        <section className="mt-6 p-4 bg-gray-900 rounded max-w-xl whitespace-pre-wrap">
          <h2 className="text-xl font-semibold mb-2">Result Summary:</h2>
          <p>{result.summary}</p>
          <h3 className="text-lg font-semibold mt-4">Launch Details:</h3>
          <pre className="text-sm overflow-x-auto">{JSON.stringify(result.launch, null, 2)}</pre>
          <h3 className="text-lg font-semibold mt-4">Weather Details:</h3>
          <pre className="text-sm overflow-x-auto">{JSON.stringify(result.weather, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}
