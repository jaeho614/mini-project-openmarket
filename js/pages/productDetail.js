import { createHeader } from "../components/headerComponent.js";
import {
  attachFooterEvents,
  createFooter,
} from "../components/footerComponent.js";
import { ProductAPI } from "../api/product.js";
import { AuthManager } from "../utils/auth.js";
import { SecurityUtils } from "../utils/security.js";
import { redirectStorage } from "../utils/storage.js";
import { loginRequestModal } from "../components/modalComponent.js";

export function ProductDetailPage(stateManager) {
  // URL에서 상품 ID 추출
  const hash = window.location.hash;
  const productId = hash.split("/")[2];

  if (!productId) {
    alert("잘못된 상품 정보입니다.");
    window.router.navigate("/");
    return;
  }

  // 페이지 렌더링
  renderProductDetailHTML();

  // 상품 정보 로드
  loadProductDetail(productId, stateManager);

  attachFooterEvents();
}

// HTML 렌더링
function renderProductDetailHTML() {
  document.getElementById("app").innerHTML = `
    ${createHeader(window.stateManager)}
    
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- 로딩 상태 -->
      <div id="product-loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p class="mt-4 text-gray-600">상품 정보를 불러오는 중...</p>
      </div>
      
      <!-- 에러 상태 -->
      <div id="product-error" class="text-center py-16 hidden">
        <p class="text-red-600 mb-4 text-lg">상품을 찾을 수 없습니다.</p>
        <button id="back-to-home" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
          홈으로 돌아가기
        </button>
      </div>
      
      <!-- 상품 상세 정보 -->
      <div id="product-detail" class="hidden">
        <div class="max-h-[600px] grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- 왼쪽: 상품 이미지 -->
          <div class="space-y-4">
            <div id="product-image-container" class="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-blue-300"></div>
          </div>
          
          <!-- 오른쪽: 상품 정보 -->
          <div>
            <!-- 판매자 정보 -->
            <div class="mb-[16px] text-lg text-gray-400" id="seller-info"></div>
            
            <!-- 상품명 -->
            <h1 id="product-name" class="mb-[20px] text-4xl font-bold text-gray-900"></h1>
            
            <!-- 가격 -->
            <div class="mb-[138px] text-3xl font-bold text-gray-900" id="product-price"></div>
            
            <!-- 배송 정보 -->
            <div class="mb-[20px]">
              <div class="flex justify-between items-center text-lg">
                <span class="text-gray-400">택배배송 / 무료배송</span>
              </div>
            </div>
            
            <!-- 수량 선택 -->
            <div class="flex items-center h-[110px] mb-[32px]" style="border-top: solid 2px #C4C4C4; border-bottom: solid 2px #C4C4C4;">
              <div class="flex items-center border border-gray-300 rounded-lg w-fit">
                <button id="quantity-minus" class="w-12 h-12 flex items-center justify-center hover:bg-gray-100 border-[2px] rounded-l-[5px] border-gray-400 transition-colors font-medium text-3xl leading-none">
                  &#45;
                </button>
                <input 
                  type="text" 
                  id="quantity-input" 
                  value="1" 
                  class="w-16 h-12 text-center focus:outline-none focus:ring-0 text-lg font-medium" style="border-top:solid 2px gray ; border-bottom: solid 2px gray;"
                />
                <button id="quantity-plus" class="w-12 h-12 flex items-center justify-center hover:bg-gray-100 border-[2px] rounded-r-[5px] border-gray-400 transition-colors font-medium text-3xl leading-none">
                  &#43;
                </button>
              </div>
            </div>
            
            <!-- 총 상품 금액 -->
            <div class="border-t border-gray-200 mb-[22px]">
              <div class="flex justify-between items-end">
                <span class="text-lg font-bold">총 상품 금액</span>
                <div class="flex items-end text-right">
                  <div class="text-lg text-gray-500">총 수량 <span id="total-quantity" class="text-green-500 text-lg font-bold">1</span>개 <span class="mx-2 text-gray-400">|</span></div>
                  <div class="text-4xl font-bold text-green-600" id="total-price"></div>
                </div>
              </div>
            </div>
            
            <!-- 구매 버튼 -->
            <div class="flex gap-3">
              <button id="buy-now-btn" class="flex-1 bg-green-500 text-white py-4 rounded-lg text-lg font-medium hover:bg-green-600 transition-colors">
                바로 구매
              </button>
              <button id="add-to-cart-btn" class="w-40 bg-gray-500 text-white py-4 rounded-lg text-lg font-medium hover:bg-gray-600 transition-colors">
                장바구니
              </button>
            </div>
          </div>
        </div>
        
        <!-- 하단 탭 섹션 -->
        <div class="mt-16">
          <div class="border-b border-gray-200">
            <nav class="flex">
              <button id="tab-detail" class="tab-button flex-1 py-4 px-2 border-b-4 border-green-500 text-green-600 font-bold text-center">
                버튼
              </button>
              <button id="tab-review" class="tab-button flex-1 py-4 px-2 border-b-4 border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 text-center transition-colors">
                리뷰
              </button>
              <button id="tab-qna" class="tab-button flex-1 py-4 px-2 border-b-4 border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 text-center transition-colors">
                Q&A
              </button>
              <button id="tab-return" class="tab-button flex-1 py-4 px-2 border-b-4 border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 text-center transition-colors">
                반품/교환정보
              </button>
            </nav>
          </div>
          
          <!-- 탭 콘텐츠 -->
          <div class="py-8">
            <div id="tab-content-detail" class="tab-content">
              <div id="product-description" class="prose max-w-none"></div>
            </div>
            
            <div id="tab-content-review" class="tab-content hidden">
              <div class="text-center py-12 text-gray-500">
                <p>아직 작성된 리뷰가 없습니다.</p>
              </div>
            </div>
            
            <div id="tab-content-qna" class="tab-content hidden">
              <div class="text-center py-12 text-gray-500">
                <p>아직 작성된 문의가 없습니다.</p>
              </div>
            </div>
            
            <div id="tab-content-return" class="tab-content hidden">
              <div class="space-y-4 text-sm text-gray-600">
                <h3 class="text-lg font-medium text-gray-900">반품/교환 정보</h3>
                <ul class="space-y-2">
                  <li>- 상품 수령일로부터 7일 이내 반품/교환 가능합니다.</li>
                  <li>- 단순 변심으로 인한 반품 시 배송비는 고객 부담입니다.</li>
                  <li>- 상품 하자 시 무료 반품/교환 가능합니다.</li>
                  <li>- 사용한 상품이나 포장을 개봉한 상품은 반품이 제한될 수 있습니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    ${createFooter()}
  `;
}

// 상품 상세 정보 로드
async function loadProductDetail(productId, stateManager) {
  const loadingEl = document.getElementById("product-loading");
  const errorEl = document.getElementById("product-error");
  const detailEl = document.getElementById("product-detail");

  try {
    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");
    detailEl.classList.add("hidden");

    // API 호출
    const product = await ProductAPI.getProduct(productId);

    // 로딩 숨기기
    loadingEl.classList.add("hidden");
    detailEl.classList.remove("hidden");

    // 상품 정보 렌더링
    renderProductInfo(product);

    // 이벤트 리스너 등록
    initializeProductDetailEvents(product, stateManager);
  } catch (error) {
    console.error("상품 로드 실패:", error);
    loadingEl.classList.add("hidden");
    errorEl.classList.remove("hidden");

    // 홈으로 돌아가기 버튼 이벤트
    document.getElementById("back-to-home").addEventListener("click", () => {
      window.router.navigate("/");
    });
  }
}

// 상품 정보 렌더링
function renderProductInfo(product) {
  // 판매자 정보
  document.getElementById("seller-info").textContent =
    product.seller.store_name || product.seller.name;

  // 상품명
  document.getElementById("product-name").textContent = product.name;

  // 가격
  const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price);
  document.getElementById(
    "product-price"
  ).innerHTML = `${formattedPrice}<span class="text-lg font-normal">원</span>`;

  // 상품 이미지
  const imageContainer = document.getElementById("product-image-container");
  if (product.image) {
    imageContainer.innerHTML = `
      <img src="${product.image}" alt="${product.name}" 
          class="w-full h-full object-cover">
    `;
  } else {
    imageContainer.innerHTML = `
      <div class="w-full h-full flex items-center justify-center text-gray-400">
        <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      </div>
    `;
  }

  // 총 가격 초기 설정
  updateTotalPrice(product.price);

  // 상품 설명
  document.getElementById("product-description").innerHTML = `
    <div class="space-y-4">
      <h3 class="text-xl font-bold">상품 정보</h3>
      <div class="whitespace-pre-wrap">${SecurityUtils.sanitizeInput(
        product.info || "상품 설명이 없습니다."
      )}</div>
    </div>
  `;
}

// 이벤트 리스너 초기화
function initializeProductDetailEvents(product, stateManager) {
  const { stock, price, name } = product;

  const quantityInput = document.getElementById("quantity-input");
  const quantityMinus = document.getElementById("quantity-minus");
  const quantityPlus = document.getElementById("quantity-plus");
  const buyNowBtn = document.getElementById("buy-now-btn");
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  // 버튼 상태 업데이트 함수들
  function updateMinusButtonState(currentValue) {
    if (currentValue <= 1) {
      // 1 이하일 때: 비활성화
      quantityMinus.disabled = true;
      quantityMinus.classList.add("opacity-50", "cursor-not-allowed");
      quantityMinus.classList.remove("hover:bg-gray-100");
    } else {
      // 2 이상일 때: 활성화
      quantityMinus.disabled = false;
      quantityMinus.classList.remove("opacity-50", "cursor-not-allowed");
      quantityMinus.classList.add("hover:bg-gray-100");
    }
  }

  function updatePlusButtonState(currentValue) {
    if (currentValue >= stock) {
      // 재고와 같거나 클 때: 비활성화
      quantityPlus.disabled = true;
      quantityPlus.classList.add("opacity-50", "cursor-not-allowed");
      quantityPlus.classList.remove("hover:bg-gray-100");
    } else {
      // 재고보다 작을 때: 활성화
      quantityPlus.disabled = false;
      quantityPlus.classList.remove("opacity-50", "cursor-not-allowed");
      quantityPlus.classList.add("hover:bg-gray-100");
    }
  }

  // 초기 버튼 상태 설정
  updateMinusButtonState(1);
  updatePlusButtonState(1);

  // 수량 입력 필드 숫자만 허용
  quantityInput.addEventListener("input", e => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) {
      e.target.value = "";
    } else if (value) {
      const currentValue = parseInt(value);
      // 재고 수량 초과 방지
      if (currentValue > stock) {
        e.target.value = stock;
      }
      const finalValue = parseInt(e.target.value) || 1;
      updateTotalPrice(price);
      updateMinusButtonState(finalValue);
      updatePlusButtonState(finalValue);
    }
  });

  quantityInput.addEventListener("blur", e => {
    // 포커스 해제 시 빈 값이면 1로 설정
    if (!e.target.value || e.target.value === "0") {
      e.target.value = "1";
      updateTotalPrice(price);
      updateMinusButtonState(1);
      updatePlusButtonState(1);
    }

    // 재고 수량 보다 큰 숫자가 입력될 경우 재고 수량 최대치로 설정
    if (Number(e.target.value) > stock) {
      e.target.value = stock;
      alert(`현재 재고 수량을 초과했습니다.(수량: ${stock})`);
      updateTotalPrice(price);
      updateMinusButtonState(stock);
      updatePlusButtonState(stock);
    }
  });

  // 수량 변경 이벤트
  quantityMinus.addEventListener("click", () => {
    if (quantityMinus.disabled) return;

    const currentValue = parseInt(quantityInput.value) || 1;
    if (currentValue > 1) {
      const newValue = currentValue - 1;
      quantityInput.value = newValue;
      updateTotalPrice(price);
      updateMinusButtonState(newValue);
      updatePlusButtonState(newValue);
    }
  });

  quantityPlus.addEventListener("click", () => {
    if (quantityPlus.disabled) return;

    const currentValue = parseInt(quantityInput.value) || 1;
    if (currentValue < stock) {
      const newValue = currentValue + 1;
      quantityInput.value = newValue;
      updateTotalPrice(price);
      updateMinusButtonState(newValue);
      updatePlusButtonState(newValue);
    }
  });

  // 구매 버튼 이벤트
  buyNowBtn.addEventListener("click", () => {
    if (!AuthManager.isAuthenticated()) {
      loginRequestModal.loginConfirm(() => {
        // 현재 페이지 저장 후 로그인 페이지로 이동
        redirectStorage.saveCurrentPageAndRedirectToLogin(window.router);
      });
      return;
    }

    alert("바로 구매 기능은 준비 중입니다.");
  });

  // 장바구니 버튼 이벤트
  addToCartBtn.addEventListener("click", () => {
    if (!AuthManager.isAuthenticated()) {
      loginRequestModal.loginConfirm(() => {
        // 현재 페이지 저장 후 로그인 페이지로 이동
        redirectStorage.saveCurrentPageAndRedirectToLogin(window.router);
      });
      return;
    }

    const quantity = parseInt(quantityInput.value) || 1;
    alert(`"${name}" ${quantity}개가 장바구니에 추가되었습니다.`);
  });

  // 탭 전환 이벤트
  initializeTabEvents();
}

// 총 가격 업데이트
function updateTotalPrice(unitPrice) {
  const quantityValue = document.getElementById("quantity-input").value;
  const quantity = parseInt(quantityValue) || 1;
  const totalPrice = unitPrice * quantity;
  const formattedTotalPrice = new Intl.NumberFormat("ko-KR").format(totalPrice);

  document.getElementById("total-quantity").textContent = quantity;
  document.getElementById(
    "total-price"
  ).innerHTML = `${formattedTotalPrice}<span class="text-lg font-normal">원</span>`;
}

// 탭 이벤트 초기화
function initializeTabEvents() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      // 모든 탭 버튼 비활성화 (회색 상태)
      tabButtons.forEach(btn => {
        btn.classList.remove("border-green-500", "text-green-600", "font-bold");
        btn.classList.add(
          "border-gray-300",
          "text-gray-400",
          "hover:text-gray-600",
          "hover:border-gray-400",
          "transition-colors"
        );
      });

      // 클릭된 탭 버튼 활성화 (초록색 상태)
      button.classList.remove(
        "border-gray-300",
        "text-gray-400",
        "hover:text-gray-600",
        "hover:border-gray-400",
        "transition-colors"
      );
      button.classList.add("border-green-500", "text-green-600", "font-bold");

      // 모든 탭 콘텐츠 숨기기
      tabContents.forEach(content => {
        content.classList.add("hidden");
      });

      // 해당 탭 콘텐츠 표시
      const tabId = button.id.replace("tab-", "tab-content-");
      document.getElementById(tabId).classList.remove("hidden");
    });
  });
}
