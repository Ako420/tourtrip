import axios, { type AxiosError } from "axios";

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

type QueryParams = Record<string, string | number | undefined>;

export const isApiEnabled = Boolean(API_URL);

// The fetch adapter keeps calls on the fetch Next.js manages, which cacheComponents relies on.
const client = axios.create({ baseURL: API_URL, timeout: 10_000, adapter: "fetch" });

client.interceptors.response.use(undefined, ({ config, response }: AxiosError<{ code?: string }>) => {
  const label = `${config?.method?.toUpperCase()} ${config?.url}`;
  const status = response?.status ?? 503;

  throw new ApiError(`${label} failed with status ${status}`, status, response?.data?.code);
});

export const apiGet = async <T>(path: string, params: QueryParams = {}): Promise<T> => {
  const query = Object.entries(params).filter(([, value]) => value !== undefined && value !== "");
  const { data } = await client.get<T>(path, { params: Object.fromEntries(query) });

  return data;
};

export const apiPost = async <T>(path: string, body: unknown): Promise<T> => {
  const { data } = await client.post<T>(path, body);

  return data;
};
