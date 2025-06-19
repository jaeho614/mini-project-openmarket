import { API_CONFIG } from "./config.js";

export class ProductAPI {
  static async getProducts(params = {}) {
    const queryParams = new URLSearchParams();

    // 페이지네이션
    if (params.page) queryParams.append("page", params.page);
    if (params.page_size) queryParams.append("page_size", params.page_size);

    // 검색/필터 (필요시 추가)
    if (params.search) queryParams.append("search", params.search);
    if (params.ordering) queryParams.append("ordering", params.ordering);

    const url = `${API_CONFIG.BASE_URL}/products/${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`상품 조회 실패: ${response.status}`);
    }

    return await response.json();
  }

  // 상품 상세 조회 (필요시 사용)
  static async getProduct(productId) {
    const response = await fetch(`${this.baseURL}/products/${productId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`상품 상세 조회 실패: ${response.status}`);
    }

    return await response.json();
  }
}
