export type AgentOutput = any;

export interface Agent {
  name: string;
  execute(input: any): Promise<AgentOutput>;
}

export class PlannerAgent implements Agent {
  name = 'PlannerAgent';

  async execute(goal: string): Promise<string[]> {
    if (goal.toLowerCase().includes('spacex')) {
      return [
        'Find next SpaceX launch',
        'Check weather at launch location',
        'Summarize if launch may be delayed',
      ];
    }
    return ['Step 1', 'Step 2', 'Step 3'];
  }
}

export class SpaceXAgent implements Agent {
  name = 'SpaceXAgent';

  async execute(input: any): Promise<any> {
    const res = await fetch('https://api.spacexdata.com/v4/launches/upcoming');
    const data = await res.json();
    const upcomingLaunches = data.filter((launch: any) => new Date(launch.date_utc) > new Date());
    upcomingLaunches.sort((a: any, b: any) => new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime());
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
      launchpad: launchpadDetails,
    };
  }
}

export class WeatherAgent implements Agent {
  name = 'WeatherAgent';

  constructor() {}

  async execute(input: any): Promise<any> {
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
    } catch (err: unknown) {
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
      launchpad: input.launchpad,
    };
  }
}

export class SummaryAgent implements Agent {
  name = 'SummaryAgent';

  async execute(input: any): Promise<string> {
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
      timeZoneName: 'short',
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
