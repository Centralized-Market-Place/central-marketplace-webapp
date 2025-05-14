import axios from "axios";
import * as humps from "humps";
import { z } from "zod";

export interface ApiResult<T> {
  data: T;
  status: number;
}

export async function apiGetFile(
  url: string,
  authToken?: string,
  headers?: Record<string, string>
): Promise<Blob> {
  const finalHeaders = {
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };

  try {
    const response = await axios.get(url, {
      headers: finalHeaders,
      responseType: "blob",
      timeout: 60000,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function apiGet<T>(
  url: string,
  schema: z.ZodSchema<T>,
  authToken?: string,
  headers?: Record<string, string>
): Promise<ApiResult<T>> {
  const finalHeaders = {
    ...{ "Content-Type": "application/json" },
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };

  const response = await axios.get<T>(url, {
    headers: finalHeaders,
    timeout: 60000,
  });
  const data: T = humps.camelizeKeys(response.data) as T;
  const validatedData = schema.parse(data);

  return {
    data: validatedData,
    status: response.status,
  };
}

export async function apiPost<T>(
  url: string,
  schema: z.ZodSchema<T>,
  payload: object,
  authToken?: string,
  headers?: Record<string, string>
): Promise<ApiResult<T>> {
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };

  const response =
    payload instanceof FormData
      ? await axios.postForm(url, payload, { headers: finalHeaders })
      : await axios.post(url, payload, { headers: finalHeaders });

  const data: T = humps.camelizeKeys(response.data) as T;
  const validatedData = schema.parse(data);

  return {
    data: validatedData,
    status: response.status,
  };
}

export async function apiPatch<T>(
  url: string,
  schema: z.ZodSchema<T>,
  payload: object,
  authToken?: string,
  headers?: Record<string, string>,
): Promise<ApiResult<T>> {
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };

  const response =
    payload instanceof FormData
      ? await axios.patchForm(url, payload, { headers: finalHeaders })
      : await axios.patch(url, payload, { headers: finalHeaders });

  const data: T = humps.camelizeKeys(response.data, { }) as T;
  const validatedData = schema.parse(data);

  return {
    data: validatedData,
    status: response.status,
  };
}

interface ApiDeleteResult {
  status: number;
}

export async function apiDelete(
  url: string,
  authToken?: string,
  headers?: Record<string, string>
): Promise<ApiDeleteResult> {
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };

  const response = await axios.delete(url, { headers: finalHeaders });

  return {
    status: response.status,
  };
}

export async function apiPut<T>(
  url: string,
  schema: z.ZodSchema<T>,
  payload: object,
  authToken?: string,
  headers?: Record<string, string>,
  signal?: AbortSignal
): Promise<ApiResult<T>> {
  const finalHeaders = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };

  const response =
    payload instanceof FormData
      ? await axios.putForm(url, payload, { headers: finalHeaders, signal })
      : await axios.put(url, payload, { headers: finalHeaders, signal });

  const data: T = humps.camelizeKeys(response.data) as T;
  const validatedData = schema.parse(data);

  return {
    data: validatedData,
    status: response.status,
  };
}

