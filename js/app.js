import { StateManager } from "./utils/state.js";
import { Router } from "./router.js";
import { AuthManager } from "./utils/auth.js";
import { AuthAPI } from "./api/auth.js";

// 페이지 컴포넌트 import
import { HomePage } from "./pages/home.js";
import { LoginPage } from "./pages/login.js";
import { SignupPage } from "./pages/signup.js";
import { MyPage } from "./pages/mypage.js";
import { ProductDetailPage } from "./pages/productDetail.js"; // 추가

class App {
  constructor() {
    this.stateManager = new StateManager();
    this.router = new Router(this.stateManager);
    this.init();
  }

  init() {
    this.setupRoutes();

    this.initializeAuth();

    this.setupGlobalEvents();

    this.setupTokenRefresh();

    this.exposeGlobals();
  }

  initializeAuth() {
    if (AuthManager.isAuthenticated()) {
      const user = AuthManager.getCurrentUser();
      this.stateManager.setUser(user);

      const currentHash = window.location.hash.slice(1) || "/";
      if (currentHash === "/" && user) {
        this.router.navigate("/");
      }

      if (currentHash === "/login" || currentHash === "/signup") {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/"
        );
        this.router.currentRoute = "/";

        setTimeout(() => {
          this.router.handleRoute();
        }, 0);
      }
    } else {
      const currentHash = window.location.hash.slice(1) || "/";
      if (currentHash === "/mypage") {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/"
        );
        this.router.currentRoute = "/";

        setTimeout(() => {
          this.router.handleRoute();
        }, 0);
      }
    }
  }

  setupRoutes() {
    this.router.addRoute("/", HomePage);
    this.router.addRoute("/login", LoginPage);
    this.router.addRoute("/signup", SignupPage);
    this.router.addRoute("/mypage", MyPage);
    this.router.addRoute("/product", ProductDetailPage);
  }

  setupGlobalEvents() {
    this.stateManager.subscribe(state => {
      setTimeout(() => {
        this.router.handleRoute();
      }, 0);
    });

    window.addEventListener("error", event => {
      console.error("Global error:", event.error);
      this.stateManager.setError("시스템 오류가 발생했습니다.");
    });

    window.addEventListener("unhandledrejection", event => {
      console.error("Unhandled promise rejection:", event.reason);
      this.stateManager.setError("네트워크 오류가 발생했습니다.");
      event.preventDefault();
    });
  }

  setupTokenRefresh() {
    setInterval(async () => {
      if (AuthManager.isAuthenticated() && AuthManager.getRefreshToken()) {
        try {
          await AuthAPI.refreshToken();
        } catch (error) {
          console.error("자동 토큰 갱신 실패:", error);
          this.handleLogout();
        }
      }
    }, 4 * 60 * 1000);
  }

  exposeGlobals() {
    window.app = this;
    window.router = this.router;
    window.stateManager = this.stateManager;

    window.handleLogout = () => this.handleLogout();
    window.showError = message => this.stateManager.setError(message);
    window.clearError = () => this.stateManager.clearError();
  }

  handleLogout() {
    AuthManager.logout();
    this.stateManager.logout();

    this.router.navigate("/");

    setTimeout(() => {
      this.router.handleRoute();
    }, 0);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new App();
});
