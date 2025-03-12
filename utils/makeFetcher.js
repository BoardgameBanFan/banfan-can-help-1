import config from "@/config/config";

export default function makeFetcher(method = "GET") {
  const fetcher = async (url, options) => {
    const arg = options?.arg;
    const res = await fetch(`${config.apiUrl}${url}`, {
      method,
      body: arg ? JSON.stringify(arg) : undefined,
      credentials: "include",
      headers: arg
        ? {
            "Content-Type": "application/json",
          }
        : undefined,
    });

    if (!res.ok) {
      const error = new Error("API request failed");
      error.status = res.status;
      error.info = await res.json();
      throw error;
    }

    if (res.status === 204) {
      return null;
    }

    return res.json();
  };

  return fetcher;
}
