import { SecureStorage } from "./storage.js";
import { SecurityUtils } from "./security.js";

export class AuthManager {
  static isAuthenticated() {
    const tokens = SecureStorage.getItem("tokens");
    const user = SecureStorage.getItem("user");

    return tokens?.access && SecurityUtils.validateToken(tokens.access) && user;
  }

  static getCurrentUser() {
    if (!this.isAuthenticated()) return null;
    return SecureStorage.getItem("user");
  }

  static getAccessToken() {
    const tokens = SecureStorage.getItem("tokens");
    return tokens?.access || null;
  }

  static getRefreshToken() {
    const tokens = SecureStorage.getItem("tokens");
    return tokens?.refresh || null;
  }

  static setTokens(accessToken, refreshToken) {
    SecureStorage.setItem("tokens", {
      access: accessToken,
      refresh: refreshToken,
    });
  }

  static setUser(user) {
    SecureStorage.setItem("user", user);
  }

  static logout() {
    SecureStorage.clear();
  }

  static requireAuth(callback) {
    if (this.isAuthenticated()) {
      callback();
    } else {
      window.location.hash = "#/login";
    }
  }
}
