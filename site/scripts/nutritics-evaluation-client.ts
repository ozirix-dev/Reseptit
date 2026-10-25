export type EvaluationRequest = {
  path: string;
  method?: "GET" | "POST";
  body?: string;
};

export type EvaluationMetric = {
  durationMs: number;
  status: number | null;
  outcome: "success" | "http-error" | "timeout" | "network-error";
  estimatedCost: number | null;
};

export type EvaluationClientOptions = {
  baseUrl?: string;
  apiKey?: string;
  /** Confirm this header name with Nutritics before making a live request. */
  apiKeyHeader?: string;
  timeoutMs?: number;
  /** Leave null until a written API price is available. */
  costPerRequest?: number | null;
  fetcher?: typeof fetch;
  onMetric?: (metric: EvaluationMetric) => void;
};

export class EvaluationClientError extends Error {
  constructor(
    message: string,
    readonly kind: "configuration" | "timeout" | "network" | "http",
    readonly status?: number,
  ) {
    super(message);
    this.name = "EvaluationClientError";
  }
}

/**
 * Explicitly invoked evaluation-only API client. It is not imported by the
 * production application and never sends a request unless request() is called.
 * A caller must inject the current API key and its confirmed header name.
 */
export class NutriticsEvaluationClient {
  private readonly baseUrl: URL;
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;
  private readonly costPerRequest: number | null;

  constructor(private readonly options: EvaluationClientOptions) {
    this.baseUrl = new URL(options.baseUrl ?? "https://www.nutritics.com/");
    this.fetcher = options.fetcher ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.costPerRequest = options.costPerRequest ?? null;
    if (this.baseUrl.protocol !== "https:") throw new EvaluationClientError("Nutritics base URL must use HTTPS", "configuration");
    if (this.baseUrl.username || this.baseUrl.password) throw new EvaluationClientError("Credentials must not be embedded in the base URL", "configuration");
    if (!Number.isFinite(this.timeoutMs) || this.timeoutMs <= 0) throw new EvaluationClientError("timeoutMs must be a positive number", "configuration");
    if (this.costPerRequest !== null && (!Number.isFinite(this.costPerRequest) || this.costPerRequest < 0)) {
      throw new EvaluationClientError("costPerRequest must be a non-negative number or null", "configuration");
    }
  }

  async request<T>(request: EvaluationRequest): Promise<T> {
    const apiKey = this.options.apiKey?.trim();
    const apiKeyHeader = this.options.apiKeyHeader?.trim();
    if (!apiKey || !apiKeyHeader) {
      throw new EvaluationClientError("API key and vendor-confirmed header name are required", "configuration");
    }
    if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(apiKeyHeader)) {
      throw new EvaluationClientError("Invalid API key header name", "configuration");
    }

    const url = new URL(request.path, this.baseUrl);
    if (url.origin !== this.baseUrl.origin || url.username || url.password) {
      throw new EvaluationClientError("Request path must stay on the configured HTTPS origin", "configuration");
    }
    for (const key of url.searchParams.keys()) {
      if (/^(api.?key|key|token|username|password)$/i.test(key)) {
        throw new EvaluationClientError("Credentials must not be placed in the request URL", "configuration");
      }
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
    let outcome: EvaluationMetric["outcome"] = "network-error";
    try {
      const responseAndBody = await Promise.race([
        this.fetcher(url, {
          method: request.method ?? "GET",
          headers: {
            [apiKeyHeader]: apiKey,
            accept: "application/json",
            ...(request.body === undefined ? {} : { "content-type": "application/json" }),
          },
          ...(request.body === undefined ? {} : { body: request.body }),
          signal: controller.signal,
        }).then(async (response) => ({
          response,
          body: response.ok ? await response.json() as T : null,
        })),
        timeoutPromise,
      ]);
      const { response, body } = responseAndBody;
      status = response.status;
      if (!response.ok) {
        outcome = "http-error";
        throw new EvaluationClientError(`Nutritics request failed with HTTP ${response.status}`, "http", response.status);
      }
      outcome = "success";
      return body as T;
    } catch (error) {
      if (error instanceof EvaluationClientError) {
        if (error.kind === "timeout") outcome = "timeout";
        throw error;
      }
      throw new EvaluationClientError("Nutritics request failed; response details were not logged", "network");
    } finally {
      if (timeout !== undefined) clearTimeout(timeout);
      this.options.onMetric?.({
        durationMs: Date.now() - started,
        status,
        outcome,
        estimatedCost: this.costPerRequest,
      });
    }
  }
}
