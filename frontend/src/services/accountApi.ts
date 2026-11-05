import axios, { type AxiosError } from "axios";
import { ApiError } from "./http";

const ACCOUNT_API_URL = (process.env.ACCOUNT_API_URL ?? process.env.API_URL)?.replace(/\/$/, "");

// Accounts connect on their own setting, so login can be live while travel pages use sample data.
export const isAccountApiEnabled = Boolean(ACCOUNT_API_URL);

export const accountClient = axios.create({ baseURL: ACCOUNT_API_URL, timeout: 5000, adapter: "fetch" });

accountClient.interceptors.response.use(undefined, ({ config, response }: AxiosError<{ code?: string }>) => {
  const label = `${config?.method?.toUpperCase()} ${config?.url}`;
  const status = response?.status ?? 503;

  throw new ApiError(`${label} failed with status ${status}`, status, response?.data?.code);
});
