import { API_CONFIG } from "./config.js";

export class ProductAPI {
  // 상품 리스트 조회
  static async getProducts(params = {}) {
    const queryParams = new URLSearchParams();

    // 페이지네이션
    if (params.page) queryParams.append("page", params.page);
    if (params.page_size) queryParams.append("page_size", params.page_size);

    const url = `${API_CONFIG.BASE_URL}/products/${
      queryParams.toString() ? "?" + queryParams.toString() : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...API_CONFIG.HEADERS,
      },
    });

    if (!response.ok) {
      throw new Error(`상품 조회 실패: ${response.status}`);
    }

    return await response.json();
  }

  // 상품 상세 조회
  static async getProduct(productId) {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}/products/${productId}/`,
      {
        method: "GET",
        headers: {
          ...API_CONFIG.HEADERS,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("상품을 찾을 수 없습니다.");
      }
      throw new Error(`상품 상세 조회 실패: ${response.status}`);
    }

    return await response.json();
  }
}
