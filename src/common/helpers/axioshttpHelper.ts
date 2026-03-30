import axios from "axios"

type axiosOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS",
    data?: object,
    headers?: object,
    timeout?: number
}

async function request(url: string, options: axiosOptions): Promise<any> {
    const defaultHeaders = {
        "Content-type": "application/json; charset=utf-8"
    };
    options.method = options.method || "GET";
    options.headers = options.headers ? { ...defaultHeaders, ...options.headers } : defaultHeaders;

    const response = await axios({ url, ...options });

    return response.data;
}

export { request };
export type { axiosOptions };
