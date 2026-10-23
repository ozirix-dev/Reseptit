import { chromium, type Browser } from "playwright";

export function launchBrowser(): Promise<Browser> {
  const channel = process.env.PLAYWRIGHT_BROWSER_CHANNEL;
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

  return chromium.launch({
    headless: true,
    ...(channel === "chrome" ? { channel: "chrome" as const } : { executablePath }),
  });
}
