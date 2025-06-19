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

    const importantChanges = changedKeys.some(key =>
      ["user", "isAuthenticated"].includes(key)
    );

    if (importantChanges) {
      this.notifyListeners();
    }
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
    this.state = { ...this.state, loading };
  }

  setError(error) {
    this.state = { ...this.state, error };
  }

  clearError() {
    this.state = { ...this.state, error: null };
  }

  setCurrentPage(page) {
    if (this.state.currentPage === page) return;
    this.state = { ...this.state, currentPage: page };
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
