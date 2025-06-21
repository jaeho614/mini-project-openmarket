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

      if (response.status === 401 && AuthManager.getRefreshToken()) {
        const newToken = await this.refreshToken();
        if (newToken) {
          config.headers["Authorization"] = `Bearer ${newToken}`;
          response = await fetch(url, config);
        }
      }

      const data = await response.json();
      // console.log("REQUEST_DATA :", data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // console.log("REQUEST_ERROR :", error);
      throw error;
    }
  }

  static async signupRequest(endpoint, options = {}) {
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

      const data = await response.json();
      // console.log("SIGNUP_REQUEST_DATA :", data);

      // 핸드폰중복 확인...(수정필요..!)
      if (data.phone_number && !response.ok) {
        throw new Error(
          data.phone_number || `HTTP error! status: ${response.status}`
        );
      }

      if (data.company_registration_number && !response.ok) {
        throw new Error(
          data.company_registration_number ||
            `HTTP error! status: ${response.status}`
        );
      }

      if (response.status === 401 && AuthManager.getRefreshToken()) {
        const newToken = await this.refreshToken();
        if (newToken) {
          config.headers["Authorization"] = `Bearer ${newToken}`;
          response = await fetch(url, config);
        }
      }

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      // console.log("SIGNUP_REQUEST_ERROR :", error);
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
    return this.signupRequest(API_CONFIG.ENDPOINTS.BUYER_SIGNUP, {
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
    return this.signupRequest(API_CONFIG.ENDPOINTS.SELLER_SIGNUP, {
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
