export type EvaluationMode = "synthetic" | "live";
export type HttpMethod = "GET" | "POST";

export type EvaluationRequest = {
  path: string;
  method?: HttpMethod;
  body?: string;
};

export type ApprovedEndpoint = {
  method: HttpMethod;
  /** Exact API path prefix, including `/api/v1.2/`, confirmed for this evaluation. */
  pathPrefix: string;
};

export type EvaluationOutcome = "success" | "http-error" | "redirect" | "timeout" | "network-error";

export type EvaluationMetric = {
  durationMs: number;
  status: number | null;
  outcome: EvaluationOutcome;
  quotaLimit: number | null;
  quotaRemaining: number | null;
  estimatedCost: number | "UNKNOWN";
  currency: string | null;
};

export type EvaluationUsage = {
  calls: number;
  successfulCalls: number;
  failedCalls: number;
  httpErrors: number;
  redirects: number;
  timeouts: number;
  networkErrors: number;
  totalDurationMs: number;
  quotaLimit: number | null;
  quotaRemaining: number | null;
  quotaUsed: number | null;
  estimatedCost: { status: "KNOWN"; amount: number; currency: string } | { status: "UNKNOWN" };
};

export type EvaluationClientOptions = {
  /** Defaults to `synthetic`; live mode must be explicitly selected. */
  mode?: EvaluationMode;
  /** Only used in synthetic mode. Live mode pins the official Nutritics origin. */
  baseUrl?: string;
  apiKey?: string;
  apiKeyHeader?: string;
  /** Set only after Nutritics confirms the current API-key header format. */
  apiKeyHeaderVerified?: boolean;
  /** Required in live mode; each path prefix must be explicitly approved. */
  approvedEndpoints?: ApprovedEndpoint[];
  timeoutMs?: number;
  /** Leave absent until a written per-call price and currency are known. */
  pricePerRequest?: { amount: number; currency: string };
  /** Synthetic mode requires an injected fake transport. Live mode defaults to fetch. */
  fetcher?: typeof fetch;
  onMetric?: (metric: EvaluationMetric) => void;
};

export class EvaluationClientError extends Error {
  constructor(
    message: string,
    readonly kind: "configuration" | "timeout" | "network" | "http" | "redirect",
    readonly status?: number,
  ) {
    super(message);
    this.name = "EvaluationClientError";
  }
}

const OFFICIAL_API_BASE_URL = "https://www.nutritics.com/";
const SYNTHETIC_BASE_URL = "https://synthetic.invalid/";

/**
 * Evaluation-only client. Synthetic mode cannot use the network because it
 * requires an injected fake transport. Live mode is opt-in, pinned to the
 * official host and gated by a verified key header plus endpoint allowlist.
 */
export class NutriticsEvaluationClient {
  private readonly mode: EvaluationMode;
  private readonly baseUrl: URL;
  private readonly fetcher: typeof fetch | undefined;
  private readonly timeoutMs: number;
  private readonly pricePerRequest: { amount: number; currency: string } | null;
  private readonly usage: Omit<EvaluationUsage, "estimatedCost"> = {
    calls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    httpErrors: 0,
    redirects: 0,
    timeouts: 0,
    networkErrors: 0,
    totalDurationMs: 0,
    quotaLimit: null,
    quotaRemaining: null,
    quotaUsed: null,
  };

  constructor(private readonly options: EvaluationClientOptions = {}) {
    this.mode = options.mode ?? "synthetic";
    this.baseUrl = new URL(this.mode === "live" ? OFFICIAL_API_BASE_URL : options.baseUrl ?? SYNTHETIC_BASE_URL);
    this.fetcher = options.fetcher ?? (this.mode === "live" ? fetch : undefined);
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.pricePerRequest = options.pricePerRequest ?? null;

    if (this.baseUrl.protocol !== "https:") throw new EvaluationClientError("Nutritics request URLs must use HTTPS", "configuration");
    if (this.baseUrl.username || this.baseUrl.password) throw new EvaluationClientError("Credentials must not be embedded in request URLs", "configuration");
    if (this.mode === "live" && this.baseUrl.origin !== "https://www.nutritics.com") {
      throw new EvaluationClientError("Live requests are pinned to the official Nutritics API origin", "configuration");
    }
    // No global fetch fallback in synthetic mode: tests must inject their own
    // fake transport, otherwise there is no possible network path.
    if (!Number.isFinite(this.timeoutMs) || this.timeoutMs <= 0) throw new EvaluationClientError("timeoutMs must be a positive number", "configuration");
    if (this.pricePerRequest && (!Number.isFinite(this.pricePerRequest.amount) || this.pricePerRequest.amount < 0 || !this.pricePerRequest.currency.trim())) {
      throw new EvaluationClientError("A known per-request price requires a non-negative amount and currency", "configuration");
    }

    if (this.mode === "live") {
      if (options.apiKeyHeaderVerified !== true || !options.apiKeyHeader?.trim()) {
        throw new EvaluationClientError("Live mode requires Nutritics-confirmed API-key header configuration", "configuration");
      }
      if (!isSafeCredentialHeader(options.apiKeyHeader)) {
        throw new EvaluationClientError("The confirmed API-key header name is invalid or reserved", "configuration");
      }
      if (!options.approvedEndpoints?.length || options.approvedEndpoints.some((endpoint) =>
        !["GET", "POST"].includes(endpoint.method) ||
        !isSafeApiPath(endpoint.pathPrefix) ||
        endpoint.pathPrefix.includes("?"))) {
        throw new EvaluationClientError("Live mode requires explicit, valid API endpoint allowlisting", "configuration");
      }
    }
  }

  getUsage(): EvaluationUsage {
    const estimatedCost = this.pricePerRequest
      ? { status: "KNOWN" as const, amount: this.usage.calls * this.pricePerRequest.amount, currency: this.pricePerRequest.currency }
      : { status: "UNKNOWN" as const };
    return { ...this.usage, estimatedCost };
  }

  async request<T>(request: EvaluationRequest): Promise<T> {
    const method = request.method ?? "GET";
    const apiKey = this.options.apiKey?.trim();
    const apiKeyHeader = this.options.apiKeyHeader?.trim();

    if (!this.fetcher) throw new EvaluationClientError("Synthetic mode needs an injected fake transport", "configuration");
    if (this.mode === "live") {
      if (!apiKey || !apiKeyHeader || this.options.apiKeyHeaderVerified !== true) {
        throw new EvaluationClientError("Live mode requires a key and vendor-confirmed header configuration", "configuration");
      }
      const allowed = this.options.approvedEndpoints!.some((endpoint) => endpoint.method === method && matchesApprovedEndpoint(request.path, endpoint));
      if (!allowed) throw new EvaluationClientError("Live request path is not in the approved endpoint allowlist", "configuration");
    }

    if (this.mode === "synthetic" && (apiKey || apiKeyHeader)) {
      throw new EvaluationClientError("Synthetic mode must not be configured with credentials", "configuration");
    }
    if (!isSafeApiPath(request.path)) {
      throw new EvaluationClientError("Request path must be a safe Nutritics API v1.2 path", "configuration");
    }
    const url = new URL(request.path, this.baseUrl);
    if (url.origin !== this.baseUrl.origin || url.username || url.password) {
      throw new EvaluationClientError("Request path must stay on the configured HTTPS origin", "configuration");
    }
    if (this.mode === "live" && !url.pathname.startsWith("/api/v1.2/")) {
      throw new EvaluationClientError("Live requests must use the confirmed Nutritics v1.2 API path", "configuration");
    }

    const started = Date.now();
    const controller = new AbortController();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => {
        controller.abort();
        reject(new EvaluationClientError("Nutritics request timed out", "timeout"));
      }, this.timeoutMs);
    });
    let status: number | null = null;
    let quotaLimit: number | null = null;
    let quotaRemaining: number | null = null;
    let outcome: EvaluationOutcome = "network-error";
    let counted = false;
    try {
      const responseAndBody = await Promise.race([
        this.fetcher(url, {
          method,
          headers: {
            ...(this.mode === "live" ? { [apiKeyHeader!]: apiKey! } : {}),
            accept: "application/json",
            ...(request.body === undefined ? {} : { "content-type": "application/json" }),
          },
          ...(request.body === undefined ? {} : { body: request.body }),
          redirect: "manual",
          signal: controller.signal,
        }).then(async (response) => ({ response, body: response.ok ? await response.json() as T : null })),
        timeoutPromise,
      ]);
      const { response, body } = responseAndBody;
      status = response.status;
      quotaLimit = readLimit(response.headers);
      quotaRemaining = readRemaining(response.headers);
      counted = true;
      if (response.status >= 300 && response.status < 400) {
        outcome = "redirect";
        throw new EvaluationClientError("Nutritics redirect refused; credentials were not forwarded", "redirect", response.status);
      }
      if (!response.ok) {
        outcome = "http-error";
        throw new EvaluationClientError(`Nutritics request failed with HTTP ${response.status}`, "http", response.status);
      }
      outcome = "success";
      return body as T;
    } catch (error) {
      if (error instanceof EvaluationClientError) {
        outcome = error.kind === "timeout" ? "timeout" : error.kind === "redirect" ? "redirect" : error.kind === "http" ? "http-error" : outcome;
        throw error;
      }
      throw new EvaluationClientError("Nutritics request failed; response details were not logged", "network");
    } finally {
      if (timeout !== undefined) clearTimeout(timeout);
      // Count only requests that reached the injected/real transport.
      if (counted || outcome === "timeout" || outcome === "network-error") {
        this.record({
          durationMs: Date.now() - started,
          status,
          outcome,
          quotaLimit,
          quotaRemaining,
          estimatedCost: this.pricePerRequest?.amount ?? "UNKNOWN",
          currency: this.pricePerRequest?.currency ?? null,
        });
      }
    }
  }

  private record(metric: EvaluationMetric): void {
    this.usage.calls += 1;
    this.usage.successfulCalls += metric.outcome === "success" ? 1 : 0;
    this.usage.failedCalls += metric.outcome === "success" ? 0 : 1;
    this.usage.httpErrors += metric.outcome === "http-error" ? 1 : 0;
    this.usage.redirects += metric.outcome === "redirect" ? 1 : 0;
    this.usage.timeouts += metric.outcome === "timeout" ? 1 : 0;
    this.usage.networkErrors += metric.outcome === "network-error" ? 1 : 0;
    this.usage.totalDurationMs += metric.durationMs;
    this.usage.quotaLimit = metric.quotaLimit ?? this.usage.quotaLimit;
    this.usage.quotaRemaining = metric.quotaRemaining ?? this.usage.quotaRemaining;
    this.usage.quotaUsed = this.usage.quotaLimit !== null && this.usage.quotaRemaining !== null
      ? Math.max(0, this.usage.quotaLimit - this.usage.quotaRemaining)
      : this.usage.quotaUsed;
    try {
      this.options.onMetric?.(metric);
    } catch {
      // Observability callbacks must not leak request data or change API results.
    }
  }
}

function isSafeApiPath(path: string): boolean {
  if (!path.startsWith("/api/v1.2/") || path.startsWith("//") || /[\\?#]/.test(path)) return false;
  // Reject traversal and encoded separators before URL normalization. Repeat
  // decoding to catch double-encoded separators without changing the request.
  let decoded = path;
  for (let depth = 0; depth < 4; depth += 1) {
    if (/%(?:25)*(?:2f|5c|3f|23)/i.test(decoded)) return false;
    try {
      const next = decodeURIComponent(decoded);
      if (next.includes("\\") || next.includes("?") || next.includes("#") || next.split("/").some((part) => part === "." || part === "..")) return false;
      if (next === decoded) return true;
      decoded = next;
    } catch {
      return false;
    }
  }
  // Excessively encoded paths are ambiguous across proxies and servers.
  if (decoded.includes("%")) return false;
  return true;
}

function matchesApprovedEndpoint(path: string, endpoint: ApprovedEndpoint): boolean {
  if (!path.startsWith(endpoint.pathPrefix)) return false;
  const tail = path.slice(endpoint.pathPrefix.length);

  // A trailing '=' declares a dynamic LIST object filter (e.g. food=banana).
  // Keep the filter within that one path segment. The Explorer documents one
  // optional LIST limit parameter; arbitrary route/query continuations are
  // deliberately not accepted.
  if (endpoint.pathPrefix.endsWith("=")) {
    if (!tail || /[\\/?#]/.test(tail) || /%(?:25)*(?:2f|5c|3f|23)/i.test(tail)) return false;
    return hasOnlyApprovedListParameters(tail);
  }

  // Other allowlist entries are exact routes unless a later review adds an
  // explicit, narrowly scoped dynamic route form.
  return path === endpoint.pathPrefix;
}

function hasOnlyApprovedListParameters(dynamicFilter: string): boolean {
  const [filter, ...parameters] = dynamicFilter.split("&");
  if (!filter || parameters.length > 1 || parameters.some((parameter) => !/^limit=\d+,\d+$/i.test(parameter))) return false;
  try {
    decodeURIComponent(filter);
    return true;
  } catch {
    return false;
  }
}

function isSafeCredentialHeader(name: string): boolean {
  if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name)) return false;
  return !["accept", "content-type", "cookie", "host", "origin", "referer", "user-agent"].includes(name.toLowerCase());
}

function readLimit(headers: Headers): number | null {
  return readNumberHeader(headers, ["ratelimit-limit", "x-ratelimit-limit"]);
}

function readRemaining(headers: Headers): number | null {
  return readNumberHeader(headers, ["ratelimit-remaining", "x-ratelimit-remaining"]);
}

function readNumberHeader(headers: Headers, names: string[]): number | null {
  for (const name of names) {
    const value = headers.get(name);
    if (value !== null && /^\d+$/.test(value)) return Number(value);
  }
  return null;
}
