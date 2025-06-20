import { API_CONFIG } from "./config.js";
import { SecurityUtils } from "../utils/security.js";
import { AuthManager } from "../utils/auth.js";

export class AuthAPI {
  static async request(endpoint, options = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const accessToken = AuthManager.getAccessToken();

    const config = {
      headers: {
        ...API_CONFIG.HEADERS,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      ...options,
    };

    try {
      let response = await fetch(url, config);
      // console.log("API RES :", response);

      if (response.status === 401 && AuthManager.getRefreshToken()) {
        const newToken = await this.refreshToken();
        if (newToken) {
          config.headers["Authorization"] = `Bearer ${newToken}`;
          response = await fetch(url, config);
        }
      }

      const data = await response.json();
      console.log("API DATA: ", data);

      // 핸드폰 중복 확인
      if (data.phone_number) {
        throw new Error(data.phone_number);
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // console.log("API ERROR: ", error);
      throw error;
    }
  }

  static async refreshToken() {
    try {
      const refreshToken = AuthManager.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`,
        {
          method: "POST",
          headers: API_CONFIG.HEADERS,
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        AuthManager.setTokens(data.access, refreshToken);
        return data.access;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      AuthManager.logout();
    }
    return null;
  }

  static async validateUsername(username) {
    return this.request(API_CONFIG.ENDPOINTS.VALIDATE_USERNAME, {
      method: "POST",
      body: JSON.stringify({ username: SecurityUtils.sanitizeInput(username) }),
    });
  }

  static async login(credentials) {
    return this.request(API_CONFIG.ENDPOINTS.LOGIN, {
      method: "POST",
      body: JSON.stringify({
        username: SecurityUtils.sanitizeInput(credentials.username),
        password: credentials.password,
      }),
    });
  }

  static async signupBuyer(userData) {
    return this.request(API_CONFIG.ENDPOINTS.BUYER_SIGNUP, {
      method: "POST",
      body: JSON.stringify({
        username: SecurityUtils.sanitizeInput(userData.username),
        password: userData.password,
        name: SecurityUtils.sanitizeInput(userData.name),
        phone_number: SecurityUtils.sanitizeInput(userData.phone_number),
      }),
    });
  }

  static async signupSeller(userData) {
    return this.request(API_CONFIG.ENDPOINTS.SELLER_SIGNUP, {
      method: "POST",
      body: JSON.stringify({
        username: SecurityUtils.sanitizeInput(userData.username),
        password: userData.password,
        name: SecurityUtils.sanitizeInput(userData.name),
        phone_number: SecurityUtils.sanitizeInput(userData.phone_number),
        company_registration_number: SecurityUtils.sanitizeInput(
          userData.company_registration_number
        ),
        store_name: SecurityUtils.sanitizeInput(userData.store_name),
      }),
    });
  }
}
