export class Router {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.routes = new Map();
    this.currentRoute = null;
    this.isHandling = false;
    this.init();
  }

  init() {
    window.addEventListener("hashchange", () => this.handleRoute());
    window.addEventListener("load", () => this.handleRoute());
  }

  addRoute(path, component) {
    this.routes.set(path, component);
  }

  navigate(path) {
    if (this.currentRoute !== path) {
      window.location.hash = path;
    }
  }

  forceNavigate(path) {
    this.currentRoute = null;
    window.location.hash = path;
  }

  handleRoute() {
    if (this.isHandling) return;

    this.isHandling = true;

    const hash = window.location.hash.slice(1) || "/";
    this.currentRoute = hash;

    // 동적 라우팅 처리 (상품 상세 페이지: /product/123)
    let matchedRoute = null;
    let component = null;

    // 정확히 일치하는 라우트 먼저 확인
    if (this.routes.has(hash)) {
      matchedRoute = hash;
      component = this.routes.get(hash);
    } else {
      // 동적 라우트 확인 (/product/123 -> /product)
      for (const [route, comp] of this.routes) {
        if (hash.startsWith(route + "/") && route !== "/") {
          matchedRoute = route;
          component = comp;
          break;
        }
      }
    }

    if (component) {
      try {
        component(this.stateManager);
      } catch (error) {
        console.error("Route component error:", error);
        this.navigate("/");
      }
    } else {
      this.navigate("/");
    }

    this.isHandling = false;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }
}
