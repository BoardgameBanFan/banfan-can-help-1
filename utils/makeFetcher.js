import config from "@/config/config";

export default function makeFetcher(method = "GET") {
  const fetcher = async (url, options) => {
    const arg = options?.arg;
    const res = await fetch(`${config.apiUrl}${url}`, {
      method,
      body: arg ? JSON.stringify(arg) : null,
      headers: arg
        ? {
            "Content-Type": "application/json",
          }
        : null,
    });

    if (!res.ok) {
      const error = new Error("API request failed");
      error.status = res.status;
      error.info = await res.json();
      throw error;
    }

    return res.json();
  };

  return fetcher;
}
