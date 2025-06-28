export const statusLevels = {
  low: {
    color: "#047857",
    background: "#fef3c7",
    description:
      "You’re cruising on a gentle caffeine wave –enjoy a subtle lift in energy and focus",
    maxLevel: 100,
  },
  moderate: {
    color: "#b45309",
    background: "#fef3c7",
    description:
      "Your mind is sharp and your senses are alive! Caffeine is fueling your productivity, but beware: you might start tapping your foot.",
    maxLevel: 200,
  },
  high: {
    color: "#e11d48",
    background: "#ffe4e6",
    description:
      "You’ve reached rocket-fuel territory! Expect racing thoughts, restless energy, and a heart that’s ready to run a marathon—maybe time to switch to water.",
    maxLevel: 9999,
  },
};

export const coffeeConsumptionHistory = {
  1727579064032: { name: "Americano", cost: 5.52 },
  1727571485301: { name: "Macchiato", cost: 6.93 },
  1727585485245: { name: "Instant Coffee (1 tsp)", cost: 4.9 },
  1727614392214: { name: "Irish Coffee", cost: 4.88 },
  1727642088808: { name: "Flat White", cost: 5.04 },
  1727600684481: { name: "Latte", cost: 3.99 },
  1727615806680: { name: "Drip Coffee (12oz)", cost: 3.59 },
  1727595771504: { name: "Red Eye", cost: 3.45 },
  1727592250322: { name: "Cortado", cost: 4.48 },
  1727584588314: { name: "Drip Coffee (12oz)", cost: 5.96 },
  1727595715018: { name: "Matcha Latte", cost: 4.49 },
  1727565390441: { name: "Vietnamese Coffee", cost: 3.38 },
  1727641229973: { name: "Flat White", cost: 5.42 },
  1727610658037: { name: "Black Coffee (8oz)", cost: 3.46 },
  1727590586957: { name: "Iced Coffee (8oz)", cost: 3.76 },
  1727601688000: { name: "Nitro Cold Brew (12oz)", cost: 4.59 },
  1727602354621: { name: "Turkish Coffee", cost: 3.96 },
  1727599341790: { name: "Double Espresso", cost: 5.89 },
  1727566519925: { name: "Flat White", cost: 3.87 },
  1727554338958: { name: "Espresso", cost: 3.51 },
  1727651270793: { name: "Drip Coffee (12oz)", cost: 5.49 },
  1727571590403: { name: "Red Eye", cost: 3.66 },
  1727613114673: { name: "Vietnamese Coffee", cost: 4.08 },
  1727553981855: { name: "Cold Brew (12oz)", cost: 4.87 },
  1727616747401: { name: "Turkish Coffee", cost: 5.38 },
  1727635847332: { name: "Black Coffee (8oz)", cost: 6.11 },
};

export const coffeeOptions = [
  { name: "Espresso", caffeine: 63 },
  { name: "Double Espresso", caffeine: 126 },
  { name: "Americano", caffeine: 96 },
  { name: "Cappuccino", caffeine: 80 },
  { name: "Latte", caffeine: 80 },
  { name: "Mocha", caffeine: 90 },
  { name: "Macchiato", caffeine: 85 },
  { name: "Flat White", caffeine: 130 },
  { name: "Cortado", caffeine: 85 },
  { name: "Red Eye", caffeine: 159 },
  { name: "Black Coffee (8oz)", caffeine: 95 },
  { name: "Iced Coffee (8oz)", caffeine: 90 },
  { name: "Cold Brew (12oz)", caffeine: 155 },
  { name: "Nitro Cold Brew (12oz)", caffeine: 215 },
  { name: "Drip Coffee (12oz)", caffeine: 120 },
  { name: "Frappuccino", caffeine: 95 },
  { name: "Turkish Coffee", caffeine: 160 },
  { name: "Irish Coffee", caffeine: 70 },
  { name: "Vietnamese Coffee", caffeine: 100 },
  { name: "Affogato", caffeine: 65 },
  { name: "Instant Coffee (1 tsp)", caffeine: 30 },
  { name: "Decaf Coffee", caffeine: 2 },
  { name: "Chai Latte", caffeine: 40 },
  { name: "Matcha Latte", caffeine: 70 },
  // Added popular options below
  { name: "Starbucks Pike Place (16oz)", caffeine: 310 },
  { name: "Starbucks Blonde Roast (16oz)", caffeine: 360 },
  { name: "Dunkin' Original Blend (14oz)", caffeine: 210 },
  { name: "Peet's Brewed Coffee (16oz)", caffeine: 267 },
  { name: "McDonald's McCafe Coffee (16oz)", caffeine: 145 },
  { name: "Tim Hortons Original Brewed (10oz)", caffeine: 140 },
  { name: "Dutch Bros Annihilator (16oz)", caffeine: 256 },
  { name: "Stumptown Cold Brew (10.5oz)", caffeine: 279 },
  { name: "Death Wish Coffee (8oz)", caffeine: 472 },
];

const halfLifeHours = 5;

export function calculateCurrentCaffeineLevel(historyData) {
  const currentTime = Date.now();
  const halfLife = halfLifeHours * 60 * 60 * 1000; // 5 hours in milliseconds
  const maxAge = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

  let totalCaffeine = 0;

  for (const [timestamp, entry] of Object.entries(historyData)) {
    const timeElapsed = currentTime - parseInt(timestamp);

    // Ignore entries older than 48 hours
    if (timeElapsed <= maxAge) {
      const caffeineInitial = getCaffeineAmount(entry.name);
      // Calculate the remaining caffeine using the half-life formula
      const remainingCaffeine =
        caffeineInitial * Math.pow(0.5, timeElapsed / halfLife);
      totalCaffeine += remainingCaffeine;
    }
  }

  return totalCaffeine.toFixed(2);
}

// Helper function to get caffeine amount based on the coffee name
export function getCaffeineAmount(coffeeName) {
  const coffee = coffeeOptions.find((c) => c.name === coffeeName);
  return coffee ? coffee.caffeine : 0;
}

export function getTopThreeCoffees(historyData) {
  const coffeeCount = {};

  // Count occurrences of each coffee type
  for (const entry of Object.values(historyData)) {
    const coffeeName = entry.name;
    if (coffeeCount[coffeeName]) {
      coffeeCount[coffeeName]++;
    } else {
      coffeeCount[coffeeName] = 1;
    }
  }

  // Convert coffeeCount object to an array of [coffeeName, count] and sort by count
  const sortedCoffees = Object.entries(coffeeCount).sort((a, b) => b[1] - a[1]);

  // Calculate total coffees consumed
  const totalCoffees = Object.values(coffeeCount).reduce(
    (sum, count) => sum + count,
    0
  );

  // Get the top 3 most popular coffees
  const topThree = sortedCoffees.slice(0, 3).map(([coffeeName, count]) => {
    const percentage = ((count / totalCoffees) * 100).toFixed(2);
    return {
      coffeeName: coffeeName,
      count: count,
      percentage: percentage + "%",
    };
  });

  return topThree;
}

export function timeSinceConsumption(utcMilliseconds) {
  const now = Date.now();
  const diffInMilliseconds = now - utcMilliseconds;

  // Convert to seconds, minutes, hours, days, and months
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  // Get the remainder for each unit
  const remainingDays = days % 30;
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  // Construct the string
  let result = "";
  if (months > 0) result += `${months}M `;
  if (remainingDays > 0) result += `${remainingDays}D `;
  if (remainingHours > 0) result += `${remainingHours}H `;
  if (remainingMinutes > 0) result += `${remainingMinutes}M `;
  if (remainingSeconds > 0 || result === "") result += `${remainingSeconds}S`; // Show seconds even if they're 0 if nothing else exists

  return result.trim(); // Remove any trailing space
}

export function calculateCoffeeStats(coffeeConsumptionHistory) {
  const dailyStats = {};
  let totalCoffees = 0;
  let totalCost = 0;
  let totalCaffeine = 0;
  let totalDaysWithCoffee = 0;

  for (const [timestamp, coffee] of Object.entries(coffeeConsumptionHistory)) {
    const date = new Date(parseInt(timestamp)).toISOString().split("T")[0]; // Extract date in YYYY-MM-DD format
    const caffeine = getCaffeineAmount(coffee.name);
    const cost = parseFloat(coffee.cost);

    // Initialize or update the daily stats
    if (!dailyStats[date]) {
      dailyStats[date] = { caffeine: 0, cost: 0, count: 0 };
    }

    dailyStats[date].caffeine += caffeine;
    dailyStats[date].cost += cost;
    dailyStats[date].count += 1;

    // Update totals
    totalCoffees += 1;
    totalCost += cost;
  }

  const days = Object.keys(dailyStats).length;
  const dailyCaffeine = {};
  for (const [date, stats] of Object.entries(dailyStats)) {
    if (stats.caffeine > 0) {
      totalCaffeine += stats.caffeine;
      totalDaysWithCoffee += 1; // Count days when caffeine was consumed
    }
  }

  // Calculate average daily caffeine and average daily cost
  const averageDailyCaffeine =
    totalDaysWithCoffee > 0
      ? (totalCaffeine / totalDaysWithCoffee).toFixed(2)
      : 0;
  const averageDailyCost =
    totalDaysWithCoffee > 0 ? (totalCost / totalDaysWithCoffee).toFixed(2) : 0;
  // console.log(totalCost, typeof totalCost);
  return {
    daily_caffeine: averageDailyCaffeine,
    daily_cost: averageDailyCost,
    average_coffees: (totalCoffees / days).toFixed(2),
    total_cost: totalCost.toFixed(2),
  };
}
