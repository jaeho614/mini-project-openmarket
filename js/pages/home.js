import { createHeader } from "../components/headerComponent.js";
import {
  attachFooterEvents,
  createFooter,
} from "../components/footerComponent.js";
import { ProductAPI } from "../api/product.js";

export function HomePage(stateManager) {
  // 캐러셀 더미 데이터
  const carouselSlides = [
    { title: "제품-1", bgColor: "bg-gray-200" },
    { title: "제품-2", bgColor: "bg-gray-300" },
    { title: "제품-3", bgColor: "bg-gray-200" },
    { title: "제품-4", bgColor: "bg-blue-200" },
    { title: "제품-5", bgColor: "bg-green-200" },
  ];

  document.getElementById("app").innerHTML = `
    ${createHeader(stateManager)}
    
    <!-- 메인 캐러셀 -->
    <section class="relative bg-gray-100 h-64 overflow-hidden">
      <div class="carousel-container relative w-full h-full">
        <!-- 캐러셀 슬라이드들 -->
        <div id="carousel-track" class="flex transition-transform duration-300 ease-in-out h-full">
          ${carouselSlides
            .map(
              slide => `
            <div class="carousel-slide min-w-full h-full ${slide.bgColor} flex items-center justify-center">
              <p class="text-gray-500">${slide.title}</p>
            </div>
          `
            )
            .join("")}
        </div>
        
        <!-- 이전/다음 버튼 -->
        <button id="carousel-prev" class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-opacity-100 rounded-full p-2 transition-all duration-200">
          <img src="./assets/icons/icon-swiper-1.svg" alt="arrow icon" class="w-[60px] h-[124px] hover:w-[66px] hover:h-[136px]" />
        </button>
        
        <button id="carousel-next" class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-opacity-100 rounded-full p-2 transition-all duration-200">
          <img src="./assets/icons/icon-swiper-2.svg" alt="arrow icon" class="w-[60px] h-[124px] hover:w-[66px] hover:h-[136px]" />
        </button>
      </div>
      
      <!-- 동적 인디케이터 -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center space-x-2" id="carousel-indicators">
        ${carouselSlides
          .map(
            (_, index) => `
          <button class="carousel-indicator w-2 h-2 rounded-full bg-black bg-opacity-60 hover:bg-opacity-100 transition-all duration-300" data-slide="${index}"></button>
        `
          )
          .join("")}
      </div>
    </section>

    <!-- 상품 목록 섹션 -->
    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- 로딩 상태 -->
      <div id="products-loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <p class="mt-2 text-gray-600">상품을 불러오는 중...</p>
      </div>
      
      <!-- 에러 상태 -->
      <div id="products-error" class="text-center py-8 hidden">
        <p class="text-red-600 mb-4">상품을 불러오는데 실패했습니다.</p>
        <button id="retry-button" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
          다시 시도
        </button>
      </div>
      
      <!-- 상품 목록 -->
      <div id="products-container" class="hidden">        
        <!-- 상품 그리드 -->
        <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <!-- 상품 카드들이 여기에 동적으로 추가됩니다 -->
        </div>
        
        <!-- 더 보기 버튼 -->
        <div id="load-more-container" class="text-center mt-8 hidden">
          <button id="load-more-button" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors">
            더 많은 상품 보기
          </button>
        </div>
        
        <!-- 상품이 없는 경우 -->
        <div id="no-products" class="text-center py-12 hidden">
          <p class="text-gray-600 text-lg">등록된 상품이 없습니다.</p>
        </div>
      </div>
    </main>
    
    ${createFooter()}
  `;

  // 캐러셀 초기화 (배열 데이터 전달)
  initCarousel(carouselSlides);
  // 상품 목록 로드
  loadProducts(stateManager);
  attachFooterEvents();
}

// 캐러셀 기능 구현
function initCarousel(slidesData) {
  let currentSlide = 0;
  const slides = document.querySelectorAll(".carousel-slide");
  const indicators = document.querySelectorAll(".carousel-indicator");
  const track = document.getElementById("carousel-track");
  const totalSlides = slidesData.length;

  // 슬라이드 이동 함수
  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    const translateX = -slideIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;

    // 인디케이터 업데이트
    indicators.forEach((indicator, index) => {
      if (index === slideIndex) {
        indicator.classList.remove("bg-opacity-60", "w-2", "h-2");
        indicator.classList.add("bg-opacity-100", "w-3", "h-3");
      } else {
        indicator.classList.remove("bg-opacity-100", "w-3", "h-3");
        indicator.classList.add("bg-opacity-60", "w-2", "h-2");
      }
    });
  }

  // 다음 슬라이드
  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
  }

  // 이전 슬라이드
  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
  }

  // 이벤트 리스너 등록
  document.getElementById("carousel-next").addEventListener("click", nextSlide);
  document.getElementById("carousel-prev").addEventListener("click", prevSlide);

  // 인디케이터 클릭 이벤트
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => goToSlide(index));
  });

  // 초기 상태 설정
  goToSlide(0);

  // 자동 슬라이드
  setInterval(nextSlide, 5000);
}

// 상품 목록 로드 함수
async function loadProducts(stateManager, page = 1) {
  const loadingEl = document.getElementById("products-loading");
  const errorEl = document.getElementById("products-error");
  const containerEl = document.getElementById("products-container");
  const gridEl = document.getElementById("products-grid");
  const noProductsEl = document.getElementById("no-products");
  const loadMoreContainer = document.getElementById("load-more-container");

  try {
    // 첫 페이지 로딩 시에만 로딩 표시
    if (page === 1) {
      loadingEl.classList.remove("hidden");
      errorEl.classList.add("hidden");
      containerEl.classList.add("hidden");
    }

    // API 호출
    const response = await ProductAPI.getProducts({ page });

    // 로딩 숨기기
    loadingEl.classList.add("hidden");

    if (response.count === 0 && page === 1) {
      // 상품이 전혀 없는 경우
      containerEl.classList.remove("hidden");
      noProductsEl.classList.remove("hidden");
      return;
    }

    // 상품 목록 표시
    containerEl.classList.remove("hidden");

    // 상품 카드 생성
    if (page === 1) {
      gridEl.innerHTML = "";
    }

    response.results.forEach(product => {
      const productCard = createProductCard(product);
      gridEl.appendChild(productCard);
    });

    // 더 보기 버튼 처리
    if (response.next) {
      loadMoreContainer.classList.remove("hidden");
      const loadMoreButton = document.getElementById("load-more-button");

      // 기존 이벤트 리스너 제거 후 새로 등록
      const newButton = loadMoreButton.cloneNode(true);
      loadMoreButton.parentNode.replaceChild(newButton, loadMoreButton);

      newButton.addEventListener("click", () => {
        const nextPage = new URL(response.next).searchParams.get("page");
        loadProducts(stateManager, parseInt(nextPage));
      });
    } else {
      loadMoreContainer.classList.add("hidden");
    }
  } catch (error) {
    console.error("상품 로드 실패:", error);
    loadingEl.classList.add("hidden");

    if (page === 1) {
      errorEl.classList.remove("hidden");

      // 재시도 버튼 이벤트
      document.getElementById("retry-button").addEventListener("click", () => {
        loadProducts(stateManager);
      });
    } else {
      // 추가 로딩 실패 시 토스트 메시지
      alert("추가 상품을 불러오는데 실패했습니다.");
    }
  }
}

// 상품 카드 생성 함수 (수정됨 - 상품 상세 페이지로 이동)
function createProductCard(product) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer";
  card.onclick = () => {
    // 상품 상세 페이지로 이동 (/product/123 형태)
    window.router.navigate(`/product/${product.id}`);
  };

  // 가격 포맷팅
  const formattedPrice = new Intl.NumberFormat("ko-KR").format(product.price);

  // 배송비 표시
  const shippingInfo =
    product.shipping_fee === 0
      ? "무료배송"
      : `배송비 ${new Intl.NumberFormat("ko-KR").format(
          product.shipping_fee
        )}원`;

  card.innerHTML = `
    <div class="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
      ${
        product.image
          ? `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-200">`
          : `<div class="w-full h-full flex items-center justify-center text-gray-400">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>`
      }
    </div>
    
    <div class="p-4">
      <!-- 브랜드/판매자 -->
      <p class="text-xs text-gray-500 mb-1">${
        product.seller.store_name || product.seller.name
      }</p>
      
      <!-- 상품명 -->
      <h3 class="font-medium text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
        ${product.name}
      </h3>
      
      <!-- 가격 -->
      <p class="text-lg font-bold text-gray-900 mb-1">
        ${formattedPrice}원
      </p>
      
      <!-- 배송 정보 -->
      <p class="text-xs text-gray-600 mb-2">${shippingInfo}</p>
      
      <!-- 재고 정보 -->
      ${
        product.stock > 0
          ? `<p class="text-xs text-green-600">재고 ${product.stock}개</p>`
          : `<p class="text-xs text-red-600">품절</p>`
      }
    </div>
  `;

  return card;
}
