export const analyticsEvents = [
  "Recipe Search", "Search Without Results", "Filter Recipes", "Reset Filters",
  "View Instructions", "Print Recipe", "Adjust Servings", "Start Cooking",
  "Complete Recipe", "Switch Language", "Open Glycemic Evidence", "Browse More Recipes",
] as const;
type AnalyticsEvent = (typeof analyticsEvents)[number];

// Keep event call sites in place while visitor analytics is disabled.
export function track(_event: AnalyticsEvent): void {}
