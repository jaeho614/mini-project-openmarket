export class StateManager {
  constructor() {
    this.state = {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      currentPage: "home",
    };
    this.listeners = new Set();
    this.isNotifying = false;
    this.previousState = { ...this.state };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setState(newState) {
    const changedKeys = Object.keys(newState).filter(
      key => this.state[key] !== newState[key]
    );

    if (changedKeys.length === 0) return;

    this.previousState = { ...this.state };
    this.state = { ...this.state, ...newState };

    this.notifyListeners();
  }

  notifyListeners() {
    if (this.isNotifying) return;

    this.isNotifying = true;
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error("State listener error:", error);
      }
    });
    this.isNotifying = false;
  }

  setUser(user) {
    this.setState({ user, isAuthenticated: !!user });
  }

  setLoading(loading) {
    this.setState({ loading });
  }

  setError(error) {
    this.setState({ error });
  }

  clearError() {
    this.setState({ error: null });
  }

  setCurrentPage(page) {
    if (this.state.currentPage === page) return;
    this.setState({ currentPage: page });
  }

  logout() {
    this.setState({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  }

  forceNotify() {
    this.notifyListeners();
  }
}
