import axios, { type AxiosError } from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL?.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiArea =
  | "accounts"
  | "attractions"
  | "bookings"
  | "cars"
  | "content"
  | "cruises"
  | "deals"
  | "flights"
  | "guides"
  | "hotels"
  | "packages"
  | "rewards"
  | "support"
  | "tours"
  | "trains";

type QueryParams = Record<string, string | number | undefined>;

type RequestOptions = {
  auth?: boolean;
  timeout?: number;
};

const API_AREAS = process.env.API_AREAS?.split(",").map((area) => area.trim()) ?? [];

// Areas go live one at a time, so a page without an API yet keeps its sample data.
export const isApiLive = (area: ApiArea) => Boolean(API_URL) && API_AREAS.includes(area);

// The fetch adapter keeps calls on the fetch Next.js manages, which cacheComponents relies on.
const client = axios.create({ baseURL: API_URL, timeout: 10_000, adapter: "fetch" });

client.interceptors.response.use(undefined, ({ config, response }: AxiosError<{ code?: string }>) => {
  const label = `${config?.method?.toUpperCase()} ${config?.url}`;
  const status = response?.status ?? 503;

  throw new ApiError(`${label} failed with status ${status}`, status, response?.data?.code);
});

// Cookies are only read with auth, because reading them stops a page from being cached.
const getConfig = async ({ auth, timeout }: RequestOptions) => {
  const token = auth ? (await cookies()).get("session")?.value : undefined;

  return { timeout, headers: token ? { Authorization: `Bearer ${token}` } : undefined };
};

export const apiGet = async <T>(path: string, params: QueryParams = {}, options: RequestOptions = {}): Promise<T> => {
  const query = Object.entries(params).filter(([, value]) => value !== undefined && value !== "");
  const { data } = await client.get<T>(path, { params: Object.fromEntries(query), ...(await getConfig(options)) });

  return data;
};

export const apiPost = async <T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> => {
  const { data } = await client.post<T>(path, body, await getConfig(options));

  return data;
};

export const apiPut = async <T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> => {
  const { data } = await client.put<T>(path, body, await getConfig(options));

  return data;
};

export const apiPatch = async <T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> => {
  const { data } = await client.patch<T>(path, body, await getConfig(options));

  return data;
};

export const apiDelete = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { data } = await client.delete<T>(path, await getConfig(options));

  return data;
};
