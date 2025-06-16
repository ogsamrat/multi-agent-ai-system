module.exports = {

"[project]/src/lib/agents.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "PlannerAgent": (()=>PlannerAgent),
    "SpaceXAgent": (()=>SpaceXAgent),
    "SummaryAgent": (()=>SummaryAgent),
    "WeatherAgent": (()=>WeatherAgent)
});
class PlannerAgent {
    name = 'PlannerAgent';
    async execute(goal) {
        if (goal.toLowerCase().includes('spacex')) {
            return [
                'Find next SpaceX launch',
                'Check weather at launch location',
                'Summarize if launch may be delayed'
            ];
        }
        return [
            'Step 1',
            'Step 2',
            'Step 3'
        ];
    }
}
class SpaceXAgent {
    name = 'SpaceXAgent';
    async execute(input) {
        const res = await fetch('https://api.spacexdata.com/v4/launches/upcoming');
        const data = await res.json();
        const upcomingLaunches = data.filter((launch)=>new Date(launch.date_utc) > new Date());
        upcomingLaunches.sort((a, b)=>new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime());
        const nextLaunch = upcomingLaunches[0];
        let launchpadDetails = null;
        if (nextLaunch && nextLaunch.launchpad) {
            const launchpadRes = await fetch(`https://api.spacexdata.com/v4/launchpads/${nextLaunch.launchpad}`);
            if (launchpadRes.ok) {
                launchpadDetails = await launchpadRes.json();
            }
        }
        return {
            launch: nextLaunch || null,
            launchpad: launchpadDetails
        };
    }
}
class WeatherAgent {
    name = 'WeatherAgent';
    constructor(){}
    async execute(input) {
        if (input.error) {
            return input;
        }
        if (!input.launchpad) {
            throw new Error('No launchpad data provided to WeatherAgent');
        }
        const { latitude, longitude } = input.launchpad;
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        let weatherRes;
        try {
            weatherRes = await fetch(weatherUrl);
        } catch (err) {
            if (err instanceof Error) {
                throw new Error('Network error fetching weather data from Open-Meteo: ' + err.message);
            } else {
                throw new Error('Network error fetching weather data from Open-Meteo');
            }
        }
        if (!weatherRes.ok) {
            throw new Error('Failed to fetch weather data from Open-Meteo');
        }
        const weatherData = await weatherRes.json();
        return {
            weather: weatherData,
            launch: input.launch,
            launchpad: input.launchpad
        };
    }
}
class SummaryAgent {
    name = 'SummaryAgent';
    async execute(input) {
        if (input.error) {
            return input.error;
        }
        const weather = input.weather;
        const launch = input.launch;
        const launchpad = input.launchpad;
        const launchDate = new Date(launch.date_utc);
        const humanDate = launchDate.toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
        let summary = `Next SpaceX launch: ${launch.name} scheduled at ${humanDate}.\n`;
        summary += `Launchpad: ${launchpad.name}, ${launchpad.region}.\n`;
        if (weather && weather.current_weather) {
            const temp = weather.current_weather.temperature;
            const windspeed = weather.current_weather.windspeed;
            summary += `Current weather at launch site: ${temp}°C, wind speed ${windspeed} km/h.`;
        } else {
            summary += 'Weather data not available.';
        }
        return summary;
    }
}
}}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>HomePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/agents.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function HomePage() {
    const [goal, setGoal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [result, setResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const openWeatherApiKey = ("TURBOPACK compile-time value", "0e3d396cbcf02149f3a143ab5c13c51b") || "";
    const runAgents = async (userGoal)=>{
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const planner = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PlannerAgent"]();
            const spaceXAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SpaceXAgent"]();
            const weatherAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["WeatherAgent"]();
            const summaryAgent = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agents$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SummaryAgent"]();
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
                weather: weatherData.weather
            });
        } catch (err) {
            setError(err.message || "Error running agents");
        } finally{
            setLoading(false);
        }
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (goal.trim() === "") {
            setError("Please enter a goal");
            return;
        }
        runAgents(goal);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-black text-white flex flex-col items-center justify-center p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold mb-6",
                children: "Multi-Agent AI System"
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "w-full max-w-xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "goal",
                        className: "block mb-2 text-lg font-semibold",
                        children: "Enter your goal:"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "goal",
                        type: "text",
                        value: goal,
                        onChange: (e)=>setGoal(e.target.value),
                        className: "w-full p-3 rounded border border-gray-600 bg-gray-900 text-white mb-4",
                        placeholder: "e.g. Find the next SpaceX launch, check weather, summarize delay"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: "w-full bg-white text-black font-semibold py-3 rounded hover:bg-gray-200 transition",
                        disabled: loading,
                        children: loading ? "Processing..." : "Run Agents"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-4 text-red-500",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 87,
                columnNumber: 17
            }, this),
            result && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mt-6 p-4 bg-gray-900 rounded max-w-xl whitespace-pre-wrap",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold mb-2",
                        children: "Result Summary:"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: result.summary
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mt-4",
                        children: "Launch Details:"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 92,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "text-sm overflow-x-auto",
                        children: JSON.stringify(result.launch, null, 2)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mt-4",
                        children: "Weather Details:"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                        className: "text-sm overflow-x-auto",
                        children: JSON.stringify(result.weather, null, 2)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 89,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),

};

//# sourceMappingURL=_10d2111b._.js.map