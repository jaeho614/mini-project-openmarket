export class SecureStorage {
  static setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Storage error:", error);
    }
  }

  static getItem(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Storage error:", error);
      return null;
    }
  }

  static removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Storage error:", error);
    }
  }

  static clear() {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Storage error:", error);
    }
  }
}

export class redirectStorage {
  /**
   * 로그인 후 돌아갈 URL을 저장
   * @param {string} url - 저장할 URL
   */
  static setRedirectUrl(url) {
    try {
      sessionStorage.setItem("redirectAfterLogin", url);
    } catch (error) {
      console.warn("SessionStorage 저장 실패:", error);
    }
  }

  /**
   * 저장된 리다이렉트 URL을 가져오기
   * @returns {string|null} 저장된 URL 또는 null
   */
  static getRedirectUrl() {
    try {
      return sessionStorage.getItem("redirectAfterLogin");
    } catch (error) {
      console.warn("SessionStorage 읽기 실패:", error);
      return null;
    }
  }

  /**
   * 저장된 리다이렉트 URL 제거
   */
  static clearRedirectUrl() {
    try {
      sessionStorage.removeItem("redirectAfterLogin");
    } catch (error) {
      console.warn("SessionStorage 제거 실패:", error);
    }
  }

  /**
   * 현재 페이지 URL을 저장하고 로그인 페이지로 이동
   * @param {Object} router - 라우터 객체
   */
  static saveCurrentPageAndRedirectToLogin(router) {
    // 현재 페이지 URL 저장
    const currentUrl = window.location.hash || "#/";
    this.setRedirectUrl(currentUrl);

    // 로그인 페이지로 이동
    router.navigate("/login");
  }

  /**
   * 로그인 성공 후 원래 페이지로 돌아가기
   * @param {Object} router - 라우터 객체
   * @param {string} defaultUrl - 저장된 URL이 없을 때 기본 이동할 URL
   */
  static redirectAfterLogin(router, defaultUrl = "/") {
    const redirectUrl = this.getRedirectUrl();

    if (redirectUrl) {
      // 저장된 URL로 이동
      this.clearRedirectUrl();
      router.navigate(redirectUrl);
    } else {
      // 기본 URL로 이동
      router.navigate(defaultUrl);
    }
  }

  /**
   * 일반적인 세션 스토리지 저장
   * @param {string} key - 저장할 키
   * @param {any} value - 저장할 값 (객체는 JSON으로 변환)
   */
  static setSessionItem(key, value) {
    try {
      const serializedValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      sessionStorage.setItem(key, serializedValue);
    } catch (error) {
      console.warn(`SessionStorage 저장 실패 (${key}):`, error);
    }
  }

  /**
   * 일반적인 세션 스토리지 조회
   * @param {string} key - 조회할 키
   * @param {boolean} parseJson - JSON 파싱 여부
   * @returns {any} 저장된 값
   */
  static getSessionItem(key, parseJson = false) {
    try {
      const value = sessionStorage.getItem(key);
      if (value === null) return null;

      return parseJson ? JSON.parse(value) : value;
    } catch (error) {
      console.warn(`SessionStorage 읽기 실패 (${key}):`, error);
      return null;
    }
  }

  /**
   * 세션 스토리지 아이템 제거
   * @param {string} key - 제거할 키
   */
  static removeSessionItem(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`SessionStorage 제거 실패 (${key}):`, error);
    }
  }

  /**
   * 세션 스토리지 전체 비우기
   */
  static clearSession() {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn("SessionStorage 전체 비우기 실패:", error);
    }
  }
}
