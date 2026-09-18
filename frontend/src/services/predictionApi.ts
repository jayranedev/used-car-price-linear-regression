import type { PredictionRequest, PredictionResponse } from '../types';

const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = (
  rawApiUrl && rawApiUrl.trim() !== ''
    ? rawApiUrl
    : (import.meta.env.PROD ? '' : 'http://127.0.0.1:8000')
).replace(/\/$/, '');

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Sends vehicle features to the FastAPI ML backend and returns the predicted price in GBP.
 */
export async function predictCarPrice(payload: PredictionRequest): Promise<PredictionResponse> {
  const endpoint = `${API_BASE_URL}/predict`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorDetail = 'Prediction request failed';
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorDetail = typeof errorData.detail === 'string'
            ? errorData.detail
            : JSON.stringify(errorData.detail);
        }
      } catch {
        errorDetail = `Server returned HTTP ${response.status}`;
      }
      throw new ApiError(errorDetail, response.status);
    }

    const data = await response.json();

    if (typeof data.predicted_price !== 'number' || isNaN(data.predicted_price)) {
      throw new ApiError('Unexpected response from prediction model: missing predicted_price');
    }

    return data as PredictionResponse;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new ApiError('Prediction request timed out. Please check if your FastAPI backend is responding.');
    }
    if (error instanceof ApiError) {
      throw error;
    }
    // Network / connection refused error
    throw new ApiError(
      "Couldn't reach the prediction service. Make sure the FastAPI backend is running at " + API_BASE_URL
    );
  }
}

/**
 * Checks if the FastAPI backend is currently accessible and healthy.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch {
    return false;
  }
}
