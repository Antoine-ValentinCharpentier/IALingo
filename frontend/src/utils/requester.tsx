import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export class Requester {
  private instance: AxiosInstance;
  private bearerToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config: CustomInternalAxiosRequestConfig) => {
        if (this.bearerToken) {
            config.headers.set("Authorization", `Bearer ${this.bearerToken}`);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest =
          error.config as CustomInternalAxiosRequestConfig;
        
        if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
          
          originalRequest._retry = true;

          if (this.refreshToken) {
            try {
              const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/auth/token/refresh`,
                {
                  token: this.refreshToken,
                }
              );
              
              if (response.status === 200) {
                this.bearerToken = response.data.data.accessToken;

                this.refreshToken = response.data.data.refreshToken;

                originalRequest.headers.set(
                    "Authorization",
                    `Bearer ${this.bearerToken}`
                );

                localStorage.setItem("IALingo-accessToken", response.data.data.accessToken)
                localStorage.setItem("IALingo-refreshToken", response.data.data.refreshToken)

                return this.instance(originalRequest);
              }
            } catch (refreshError) {
              console.error(
                "Erreur lors du rafraîchissement du token:",
                refreshError
              );
              return Promise.reject(refreshError);
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public updateTokens(newAccessToken: string, newRefreshToken: string) {
    this.bearerToken = newAccessToken;
    this.refreshToken = newRefreshToken;
  }

  public async get<T>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<{ ok: boolean; data: T | null; code: number | null }> {
    try {
      const response = await this.instance.get<T>(url, config);
      return {
        ok: true,
        data: response.data,
        code: response.status,
      };
    } catch (error:any) {
      console.error("error",error)
      return {
        ok: false,
        data: error.response.data,
        code: error.response.status || null,
      };
    }
  }

  public async post<T>(
    url: string,
    data: any,
    config?: InternalAxiosRequestConfig
  ): Promise<{ ok: boolean; data: T | null; code: number | null }> {
    try {
      const response = await this.instance.post<T>(url, data, config);
      return {
        ok: true,
        data: response.data,
        code: response.status,
      };
    } catch (error:any) {
      console.error("error",error)
      return {
        ok: false,
        data: error.response.data,
        code: error.response.status || null,
      };
    }
  }
}

const requester = new Requester(process.env.REACT_APP_API_URL || "http://localhost:8000");

export default requester;