import { attachFooterEvents } from "../components/footerComponent.js";
import { createLoginInput, createAlert } from "../components/formComponent.js";
import { AuthAPI } from "../api/auth.js";
import { AuthManager } from "../utils/auth.js";
import { Validator } from "../utils/validation.js";
import { MESSAGES } from "../constants/messages.js";

export function LoginPage(stateManager) {
  if (AuthManager.isAuthenticated()) {
    alert(MESSAGES.ERROR.ALREADY_LOGIN);
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + "#/"
    );
    window.router.currentRoute = "/";

    setTimeout(() => {
      window.router.handleRoute();
    }, 0);

    return;
  }

  document.getElementById("app").innerHTML = `
        <main class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="card mx-auto shadow-lg"">
          <div class="text-center">
            <img class="mx-auto h-16 w-auto" src="./assets/images/Logo-hodu.png" alt="HODU">
          </div>
            <div class="min-w-[380px] bg-white rounded-lg border p-8">
              <div class="flex mb-8">
                <button id="buyer-tab" class="flex-1 py-3 px-4 text-center border-b-2 border-green-500 text-green-500 font-medium">
                  구매회원 로그인
                </button>
                <button id="seller-tab" class="flex-1 py-3 px-4 text-center border-b-2 border-gray-200 text-gray-500 font-medium hover:text-gray-700">
                  판매회원 로그인
                </button>
              </div>
              <form id="loginForm">
                  ${createLoginInput(
                    "username",
                    "아이디",
                    "text",
                    "아이디",
                    true
                  )}
                  ${createLoginInput(
                    "password",
                    "비밀번호",
                    "password",
                    "비밀번호",
                    true
                  )}
                  <div id="error-container" class="error-space"></div>
                  <button type="submit" class="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200">
                      로그인
                  </button>
              </form>
            
            <div class="mt-6 text-center text-sm">
              <a href="#/signup" class="text-black hover:text-green-600 font-medium">
                회원가입
              </a>
              <span class="mx-2 text-gray-400">|</span>
              <a href="#/" class="text-black hover:text-green-600 font-medium">
                비밀번호 찾기
              </a>
            </div>
          </div>
        </div>
    </main>
    `;

  // 탭 전환 기능 초기화
  initTabs();

  document
    .getElementById("loginForm")
    .addEventListener("submit", e => handleLogin(e, stateManager));
  attachFooterEvents();
}

// 탭 전환 기능
function initTabs() {
  const buyerTab = document.getElementById("buyer-tab");
  const sellerTab = document.getElementById("seller-tab");

  function switchTab(activeTab, inactiveTab, userType) {
    // 활성 탭 스타일
    activeTab.classList.remove("border-gray-200", "text-gray-500");
    activeTab.classList.add("border-green-500", "text-green-500");

    // 비활성 탭 스타일
    inactiveTab.classList.remove("border-green-500", "text-green-500");
    inactiveTab.classList.add("border-gray-200", "text-gray-500");

    // 현재 선택된 사용자 타입 저장
    window.currentUserType = userType;
  }

  // 탭 클릭 이벤트
  buyerTab.addEventListener("click", () => {
    switchTab(buyerTab, sellerTab, "buyer");
  });

  sellerTab.addEventListener("click", () => {
    switchTab(sellerTab, buyerTab, "seller");
  });

  // 초기 상태: 구매회원 탭 활성화
  window.currentUserType = "buyer";
}

// loginPage용 에러 메시지 표시 함수
function showLoginErrorMessage(message) {
  const errorContainer = document.getElementById("error-container");

  // createAlert 함수 사용해서 에러 메시지 생성
  const errorHTML = createAlert(message, "error");
  errorContainer.innerHTML = errorHTML;
}

// 에러 메시지 숨기기 함수
function hideErrorMessage() {
  const errorContainer = document.getElementById("error-container");
  if (errorContainer) {
    errorContainer.innerHTML = "";
  }
}

async function handleLogin(e, stateManager) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const credentials = {
    username: formData.get("username").trim(),
    password: formData.get("password"),
  };

  const usernameError = Validator.validateUsername(credentials.username);
  const passwordError = Validator.validatePassword(credentials.password);

  if (usernameError) {
    showLoginErrorMessage(usernameError);
    return;
  }

  if (passwordError) {
    showLoginErrorMessage(passwordError);
    return;
  }

  try {
    hideErrorMessage();

    const response = await AuthAPI.login(credentials);

    AuthManager.setTokens(response.access, response.refresh);
    AuthManager.setUser(response.user);
    stateManager.setUser(response.user);

    window.router.navigate("/");
  } catch (error) {
    // API 에러 표시
    showLoginErrorMessage(error.message);
  }
}
