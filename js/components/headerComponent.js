import { SecurityUtils } from "../utils/security.js";
import { MyPageModal } from "./modalComponent.js";

// 전역 이벤트 리스너 설정
let globalEventAttached = false;

function setupGlobalHeaderEvents() {
  if (globalEventAttached) return;

  // 마이페이지 버튼 클릭 처리
  document.addEventListener("click", e => {
    if (e.target.closest("#mypage-btn")) {
      e.preventDefault();
      e.stopPropagation();

      const mypageBtn = e.target.closest("#mypage-btn");
      MyPageModal.toggle(mypageBtn);
    }
  });

  globalEventAttached = true;
}

export function createHeader(stateManager) {
  const { isAuthenticated, user } = stateManager.state;

  setupGlobalHeaderEvents();

  return `
    <header class="bg-white shadow-md border-b">
      <div class="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        <div class="flex items-center space-x-6">

          <!-- LOGO -->
          <a href="#/" style="cursor: pointer;">
            <img class="h-8" src="./assets/images/Logo-hodu.png" alt="HODU" />
          </a>

          <!-- 검색창 -->
          <div class="relative w-72">
            <input type="text" placeholder="상품을 검색해보세요!"
              class="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400" />
            <button class="absolute right-3 top-2.5 text-gray-400">
              <img src="./assets/images/search.png" alt="검색" class="w-5 h-5"/>
            </button>
          </div>
        </div>

        <!-- 우측 네비게이션 -->
        <div class="flex space-x-6 text-sm text-gray-700">

          <!-- 장바구니 -->
          <a href="#/cart" class="group hover:text-green-600 flex flex-col items-center justify-center text-gray-700">
            <img src="./assets/icons/icon-shopping-cart.svg" alt="장바구니" class="block group-hover:hidden w-6 h-6" />
            <img src="./assets/icons/icon-shopping-cart-2.svg" alt="장바구니" class="hidden group-hover:block w-6 h-6" />
            <span class="text-xs mt-1">장바구니</span>
          </a>

          ${
            isAuthenticated
              ? `
              <!-- 마이페이지 -->
              <button id="mypage-btn" class="group hover:text-green-600 flex flex-col items-center justify-center text-gray-700 relative">
                <img src="./assets/icons/icon-user.svg" alt="마이페이지" class="block group-hover:hidden w-6 h-6" />
                <img src="./assets/icons/icon-user-2.svg" alt="마이페이지" class="hidden group-hover:block w-6 h-6" />
                <span class="text-xs mt-1">마이페이지</span>
              </button>

              <!-- 사용자 정보 -->
              <div class="flex items-center space-x-3">
                <div class="text-sm text-gray-700">
                  <p class="font-medium">안녕하세요,
                    <span class="text-green-600 text-base font-bold">${SecurityUtils.sanitizeInput(
                      user.name
                    )}</span>님
                  </p>
                  <div class="h-8 flex justify-end">
                    <span class="p-[6px] text-xs text-white font-bold bg-green-600 rounded-md flex justify-center items-center">
                      ${user.user_type === "BUYER" ? "구매자" : "판매자"}
                    </span>
                  </div>
                </div>
              </div>
            `
              : `
              <!-- 로그인 -->
              <button onclick="window.router.navigate('#/login')" class="group hover:text-green-600 flex flex-col items-center justify-center text-gray-700">
                <img src="./assets/icons/icon-user.svg" alt="로그인" class="block group-hover:hidden w-6 h-6" />
                <img src="./assets/icons/icon-user-2.svg" alt="로그인" class="hidden group-hover:block w-6 h-6"/>
                <span class="text-xs mt-1">로그인</span>
              </button>
            `
          }
        </div>
      </div>
    </header>
  `;
}

// logout
window.handleLogoutAndReload = function () {
  window.handleLogout();

  setTimeout(() => {
    window.stateManager.forceNotify();
  }, 100);
};
