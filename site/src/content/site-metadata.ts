export const siteName = "Recipavo";

export function siteTitle(title: string): string {
  return `${title} | ${siteName}`;
}

export function websiteJsonLd(url: string) {
  return { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url };
}
