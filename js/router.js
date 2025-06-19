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

    const component = this.routes.get(hash);
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
