export interface SiteTarget {
  basePath: "/" | "/Reseptit/";
  baseUrl: string;
  noIndex: boolean;
}

export function resolveSiteTarget(previewOrigin?: string): SiteTarget {
  if (previewOrigin === undefined) {
    return { basePath: "/Reseptit/", baseUrl: "https://ozirix-dev.github.io/Reseptit", noIndex: false };
  }
  // The root-path preview cannot emit a production domain.
  if (!/^https:\/\/(?:[a-z0-9-]+\.)+pages\.dev$/i.test(previewOrigin)) {
    throw new Error("RECIPAVO_PREVIEW_ORIGIN must be an HTTPS pages.dev origin without a trailing slash");
  }
  return { basePath: "/", baseUrl: previewOrigin, noIndex: true };
}

declare const __RECIPE_SITE_TARGET__: SiteTarget;
export const siteTarget = typeof __RECIPE_SITE_TARGET__ !== "undefined"
  ? __RECIPE_SITE_TARGET__
  : resolveSiteTarget(typeof process === "undefined" ? undefined : process.env.RECIPAVO_PREVIEW_ORIGIN);
