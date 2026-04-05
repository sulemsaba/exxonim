import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

export function createHttpClient(baseURL: string, timeout = 5000): AxiosInstance {
  return axios.create({
    baseURL,
    timeout,
  });
}

export function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token: string
) {
  setRequestHeader(config, "Authorization", `Bearer ${token}`);
}

export function setRequestHeader(
  config: InternalAxiosRequestConfig,
  headerName: string,
  value: string
) {
  if (config.headers && "set" in config.headers) {
    config.headers.set(headerName, value);
    return;
  }

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if ("set" in config.headers) {
    config.headers.set(headerName, value);
    return;
  }

  (config.headers as Record<string, string>)[headerName] = value;
}
