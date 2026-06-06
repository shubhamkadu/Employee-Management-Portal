const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com";
import type { Employee, DummyUser } from "@/types/employee";

interface ApiError extends Error {
  status?: number;
  code?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = new Error(
        `HTTP Error: ${response.status} ${response.statusText}`,
      ) as ApiError;
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  }

  async getUsers(
    params: {
      limit?: number;
      skip?: number;
      select?: string;
      sortBy?: string;
      order?: "asc" | "desc";
    } = {},
  ): Promise<{
    users: DummyUser[];
    total: number;
    skip: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params.limit !== undefined)
      queryParams.append("limit", String(params.limit));
    if (params.skip !== undefined)
      queryParams.append("skip", String(params.skip));
    if (params.select) queryParams.append("select", params.select);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.order) queryParams.append("order", params.order);

    const url = `${this.baseUrl}/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    return this.handleResponse(response);
  }

  async searchUsers(
    query: string,
    params: {
      limit?: number;
      skip?: number;
    } = {},
  ): Promise<{
    users: DummyUser[];
    total: number;
    skip: number;
    limit: number;
  }> {
    const queryParams = new URLSearchParams();
    queryParams.append("q", query);

    if (params.limit !== undefined)
      queryParams.append("limit", String(params.limit));
    if (params.skip !== undefined)
      queryParams.append("skip", String(params.skip));

    const url = `${this.baseUrl}/users/search?${queryParams.toString()}`;

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    return this.handleResponse(response);
  }

  async getUserById(id: number): Promise<DummyUser> {
    const url = `${this.baseUrl}/users/${id}`;

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    return this.handleResponse(response);
  }

  async addUser(userData: Partial<DummyUser>): Promise<DummyUser> {
    const url = `${this.baseUrl}/users/add`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }
}

export const apiService = new ApiService(API_BASE_URL as string);
