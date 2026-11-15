export interface SiteTarget {
  basePath: "/";
  baseUrl: string;
  noIndex: boolean;
  production: boolean;
}

export function resolveSiteTarget(previewOrigin?: string, buildTarget?: string): SiteTarget {
  if (buildTarget !== undefined) {
    if (buildTarget !== "production" || previewOrigin !== undefined) {
      throw new Error("RECIPAVO_BUILD_TARGET=production cannot be combined with a preview origin");
    }
    return { basePath: "/", baseUrl: "https://www.recipavo.com", noIndex: false, production: true };
  }
  if (previewOrigin === undefined) {
    return { basePath: "/", baseUrl: "http://127.0.0.1:4173", noIndex: true, production: false };
  }
  // The root-path preview cannot emit a production domain.
  if (!/^https:\/\/(?:[a-z0-9-]+\.)+pages\.dev$/i.test(previewOrigin)) {
    throw new Error("RECIPAVO_PREVIEW_ORIGIN must be an HTTPS pages.dev origin without a trailing slash");
  }
  return { basePath: "/", baseUrl: previewOrigin, noIndex: true, production: false };
}

declare const __RECIPE_SITE_TARGET__: SiteTarget;
export const siteTarget = typeof __RECIPE_SITE_TARGET__ !== "undefined"
  ? __RECIPE_SITE_TARGET__
  : resolveSiteTarget(process.env.RECIPAVO_PREVIEW_ORIGIN, process.env.RECIPAVO_BUILD_TARGET);
