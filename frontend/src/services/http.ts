const API_URL = process.env.API_URL?.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type QueryParams = Record<string, string | number | undefined>;

export const isApiEnabled = Boolean(API_URL);

const parseResponse = async <T>(response: Response, label: string): Promise<T> => {
  if (!response.ok) {
    throw new ApiError(`${label} failed with status ${response.status}`, response.status);
  }

  return response.json();
};

export const apiGet = async <T>(path: string, params: QueryParams = {}): Promise<T> => {
  const url = new URL(`${API_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return parseResponse<T>(await fetch(url), `GET ${path}`);
};

export const apiPost = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return parseResponse<T>(response, `POST ${path}`);
};
