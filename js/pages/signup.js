import {
  createSingUpInput,
  createAlert,
  createSingUpPasswordInput,
} from "../components/formComponent.js";
import { AuthAPI } from "../api/auth.js";
import { AuthManager } from "../utils/auth.js";
import { SignupValidator } from "../utils/validation.js";
import { MESSAGES } from "../constants/messages.js";

export function SignupPage(stateManager) {
  // 이미 로그인된 경우 홈으로 리다이렉트
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

  // HTML 렌더링
  renderSignupHTML();

  // 초기화 함수들 실행
  initializeSignupPage(stateManager);
}

// HTML 렌더링 함수
function renderSignupHTML() {
  document.getElementById("app").innerHTML = `
    <main class="container">
    <!-- 로고 -->
    <div class="text-center mb-8">
      <img class="mt-10 mx-auto h-16 w-auto" src="./assets/images/Logo-hodu.png" alt="HODU">
    </div>
      <div class="card mx-auto px-4 py-8 max-w-md [box-shadow:0_2px_10px_rgba(0,0,0,0.1)]">
        <!-- 탭 메뉴 -->
        <div class="grid grid-cols-2 mb-8">
          <button id="signup-buyer-tab" class="signup-tab py-3 px-4 text-green-500 border-b-2 border-green-500 bg-white rounded-tl-lg font-medium">
            구매회원가입
          </button>
          <button id="signup-seller-tab" class="signup-tab py-3 px-4 text-gray-500 bg-gray-200 border-b-2 border-gray-200 rounded-tr-lg font-medium">
            판매회원가입
          </button>
        </div>

        <!-- 회원가입 폼 -->
        <form id="signupForm" class="space-y-6">
          <!-- 공통 필드 -->
          <div id="commonFields">
            <!-- 아이디 -->
            <div style="display: flex; gap: 10px; align-items: center;">
              ${createSingUpInput("username", "아이디", "text", true)}
              <button type="button" id="validateUsernameBtn" class="w-[150px] h-[46px] mt-[18px] px-4 py-2 bg-[#21BF48] text-white text-sm font-medium rounded-md hover:opacity-80 transition-colors duration-200 whitespace-nowrap">
                  중복확인
                </button>
            </div>
            <div id="usernameValidation" class="text-sm mt-1"></div>

            <!-- 비밀번호 -->
            ${createSingUpPasswordInput(
              "password",
              "비밀번호",
              "password",
              true
            )}
            <div id="passwordValidation" class="text-sm mt-1"></div>

            <!-- 비밀번호 확인 -->
            ${createSingUpPasswordInput(
              "confirmPassword",
              "비밀번호 확인",
              "password",
              true
            )}
            <div id="confirmPasswordValidation" class="text-sm mt-1"></div>

            <!-- 이름 -->
            ${createSingUpInput("name", "이름", "text", true)}
            <div id="nameValidation" class="text-sm mt-1"></div>

            <!-- 휴대폰 번호 -->
            <div class="form-group">
              <label for="phone-prefix">
                <span style="color: red;">*</span> 휴대폰번호
              </label>
              <div class="flex gap-2 mt-[10px]">
                <select id="phone-prefix" class="form-control w-20" required>
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                  <option value="019">019</option>
                </select>
                <input
                  type="text"
                  id="phone-middle"
                  name="phone-middle"
                  class="form-control flex-1"
                  maxlength="4"
                  pattern="[0-9]{3,4}"
                  required
                >
                <input
                  type="text"
                  id="phone-last"
                  name="phone-last"
                  class="form-control flex-1"
                  maxlength="4"
                  pattern="[0-9]{4}"
                  required
                >
                <!-- 숨겨진 실제 전화번호 필드 -->
                <input type="hidden" id="phone_number" name="phone_number">
              </div>
            </div>
            <div id="phoneValidation" class="text-sm mt-1"></div>
          </div>

          
          <!-- 판매자 전용 필드 -->
          <div id="sellerFields" style="display: none;">
            ${createSingUpInput(
              "company_registration_number",
              "사업자 등록번호",
              "text",
              false
            )}
            <div id="companyValidation" class="text-sm mt-1"></div>
            
            ${createSingUpInput("store_name", "스토어 이름", "text", false)}
            <div id="storeValidation" class="text-sm mt-1"></div>
            </div>
            
            <!-- 이용약관 동의 -->
            <div class="form-group">
            <div class="flex items-center space-x-2" id="agreement-container">
            <input type="checkbox" id="agreement" name="agreement" class="form-checkbox">
            <label for="agreement" class="text-sm">
            <span style="color: red;">*</span>
            <span class="text-green-600 underline cursor-pointer hover:opacity-70">이용약관</span> 및
                <span class="text-green-600 underline cursor-pointer hover:opacity-0">개인정보처리방침</span>에 대한 내용을 확인하였고 동의합니다.
              </label>
            </div>
            <div id="agreementValidation" class="text-sm mt-1"></div>
          </div>
          
          <!-- 회원가입 버튼 -->
          <button type="submit" id="signupBtn" class="btn btn-primary w-full px-4 py-3 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed transition-colors duration-200" disabled>
            가입하기
          </button>
        </form>
        </div>
        <!-- 전체 에러 메시지 -->
        <div id="signup-error-container" class="error-space"></div>
    </main>

    <!-- 동의하기 툴팁 -->
    <div id="agreement-tooltip" class="fixed bg-[#21BF48] text-white font-bold px-3 py-2 rounded shadow-lg text-sm z-50 hidden">
      약관에 동의해주세요
      <div class="absolute top-full left-2 w-0 h-0"
     style="border-left: 0 solid transparent; 
            border-right: 8px solid transparent; 
            border-top: 8px solid #21BF48;"></div>
    </div>
  `;
}

// 초기화 함수
function initializeSignupPage(stateManager) {
  // 탭 기능 초기화
  initSignupTabs();

  // 전화번호 입력 기능 초기화
  initPhoneNumberInput();

  // 실시간 유효성 검사 초기화
  initRealTimeValidation();

  // 순차 입력 검증 초기화
  initSequentialValidation();

  // 버튼 상태 관리 초기화
  initButtonStateManagement();

  // 이벤트 리스너 등록
  registerEventListeners(stateManager);

  // 초기 상태 설정 (구매자 탭 활성화)
  setActiveTab("buyer");
  handleUserTypeChange("buyer");
}

// 탭 기능 초기화
function initSignupTabs() {
  const buyerTab = document.getElementById("signup-buyer-tab");
  const sellerTab = document.getElementById("signup-seller-tab");

  buyerTab.addEventListener("click", () => {
    setActiveTab("buyer");
    handleUserTypeChange("buyer");
  });

  sellerTab.addEventListener("click", () => {
    setActiveTab("seller");
    handleUserTypeChange("seller");
  });
}

// 탭 활성화 상태 설정
function setActiveTab(userType) {
  const buyerTab = document.getElementById("signup-buyer-tab");
  const sellerTab = document.getElementById("signup-seller-tab");

  if (userType === "buyer") {
    buyerTab.className =
      "signup-tab py-3 px-4 text-green-500 border-b-2 border-green-500 bg-white rounded-tl-lg font-medium";
    sellerTab.className =
      "signup-tab py-3 px-4 text-gray-500 bg-gray-200 border-b-2 border-gray-200 rounded-tr-lg font-medium hover:text-gray-700";
  } else {
    buyerTab.className =
      "signup-tab py-3 px-4 text-gray-500 bg-gray-200 border-b-2 border-gray-200 rounded-tl-lg font-medium hover:text-gray-700";
    sellerTab.className =
      "signup-tab py-3 px-4 text-green-500 border-b-2 border-green-500 bg-white rounded-tr-lg font-medium";
  }

  // 현재 사용자 타입 저장
  window.currentUserType = userType;
}

// 사용자 타입 변경 처리
function handleUserTypeChange(userType) {
  const sellerFields = document.getElementById("sellerFields");
  const companyInput = document.getElementById("company_registration_number");
  const storeInput = document.getElementById("store_name");

  if (userType === "seller") {
    // 판매자 필드 표시 및 필수 설정
    sellerFields.style.display = "block";
    if (companyInput) {
      companyInput.setAttribute("required", "");
      updateFieldLabel(companyInput, "사업자 등록번호", true);
    }
    if (storeInput) {
      storeInput.setAttribute("required", "");
      updateFieldLabel(storeInput, "스토어 이름", true);
    }
  } else {
    // 구매자 필드 숨김 및 필수 해제
    sellerFields.style.display = "none";
    if (companyInput) {
      companyInput.removeAttribute("required");
      companyInput.value = "";
      updateFieldLabel(companyInput, "사업자 등록번호", false);
      clearFieldValidation("companyValidation");
    }
    if (storeInput) {
      storeInput.removeAttribute("required");
      storeInput.value = "";
      updateFieldLabel(storeInput, "스토어 이름", false);
      clearFieldValidation("storeValidation");
    }
  }
}

// 순차 입력 검증 초기화
function initSequentialValidation() {
  const requiredFields = [
    "username",
    "password",
    "confirmPassword",
    "name",
    "phone-middle",
    "phone-last",
  ];

  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("focus", () => {
        checkSequentialInput(fieldId);
      });
    }
  });

  // 판매자 필드도 추가
  const sellerFields = ["company_registration_number", "store_name"];
  sellerFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("focus", () => {
        if (window.currentUserType === "seller") {
          checkSequentialInput(fieldId, true);
        }
      });
    }
  });
}

// 순차 입력 확인
function checkSequentialInput(currentFieldId, isSeller = false) {
  const userType = window.currentUserType || "buyer";

  // 기본 필드 순서
  let fieldOrder = [
    "username",
    "password",
    "confirmPassword",
    "name",
    "phone-middle",
    "phone-last",
  ];

  // 판매자인 경우 필드 추가
  if (userType === "seller") {
    fieldOrder.push("company_registration_number", "store_name");
  }

  const currentIndex = fieldOrder.indexOf(currentFieldId);
  if (currentIndex === -1) return;

  // 현재 필드 이전의 모든 필드가 입력되었는지 확인
  for (let i = 0; i < currentIndex; i++) {
    const fieldId = fieldOrder[i];
    const field = document.getElementById(fieldId);

    if (field && !field.value.trim()) {
      // 빈 필드에 에러 메시지 표시
      const validationId = getValidationId(fieldId);
      showFieldValidation(validationId, MESSAGES.ERROR.FIELD_REQUIRED);
    }
  }
}

// 필드 라벨 업데이트
function updateFieldLabel(input, labelText, isRequired) {
  const label = input.previousElementSibling;
  if (label) {
    if (isRequired) {
      label.innerHTML = `<span style="color: red;">*</span> ${labelText}`;
    } else {
      label.innerHTML = labelText;
    }
  }
}

// 전화번호 입력 기능 초기화
function initPhoneNumberInput() {
  const phonePrefix = document.getElementById("phone-prefix");
  const phoneMiddle = document.getElementById("phone-middle");
  const phoneLast = document.getElementById("phone-last");
  const phoneNumber = document.getElementById("phone_number");

  // 숫자만 입력 가능하도록 제한
  function numberOnly(e) {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)
    ) {
      e.preventDefault();
    }
  }

  phoneMiddle.addEventListener("keydown", numberOnly);
  phoneLast.addEventListener("keydown", numberOnly);

  // 전화번호 조합 및 업데이트
  function updatePhoneNumber() {
    const fullNumber = phonePrefix.value + phoneMiddle.value + phoneLast.value;
    phoneNumber.value = fullNumber;
  }

  phonePrefix.addEventListener("change", updatePhoneNumber);
  phoneMiddle.addEventListener("input", updatePhoneNumber);
  phoneLast.addEventListener("input", updatePhoneNumber);

  // 자동 포커스 이동
  phoneMiddle.addEventListener("input", function () {
    if (this.value.length === 4) {
      phoneLast.focus();
    }
  });
}

// 실시간 유효성 검사 초기화
function initRealTimeValidation() {
  // 아이디 실시간 검사
  const usernameInput = document.getElementById("username");
  usernameInput.addEventListener("blur", () => {
    const error = SignupValidator.validateUsername(usernameInput.value);
    showFieldValidation("usernameValidation", error);
  });

  // 비밀번호 실시간 검사
  const passwordInput = document.getElementById("password");
  passwordInput.addEventListener("blur", () => {
    const error = SignupValidator.validatePassword(passwordInput.value);
    showFieldValidation("passwordValidation", error);

    // 체크 아이콘 토글
    const checkIcon = document.getElementById("password-check-icon");
    if (!error && passwordInput.value.trim()) {
      checkIcon.classList.remove("hidden");
    } else {
      checkIcon.classList.add("hidden");
    }
  });

  // 비밀번호 확인 실시간 검사
  const confirmPasswordInput = document.getElementById("confirmPassword");
  confirmPasswordInput.addEventListener("blur", () => {
    const password = document.getElementById("password").value;
    const error = SignupValidator.validatePasswordMatch(
      password,
      confirmPasswordInput.value
    );
    showFieldValidation("confirmPasswordValidation", error);

    // 체크 아이콘 토글
    const checkIcon = document.getElementById("confirmPassword-check-icon");
    if (
      !error &&
      confirmPasswordInput.value.trim() &&
      password === confirmPasswordInput.value
    ) {
      checkIcon.classList.remove("hidden");
    } else {
      checkIcon.classList.add("hidden");
    }
  });

  // 이름 실시간 검사
  const nameInput = document.getElementById("name");
  nameInput.addEventListener("blur", () => {
    const error = SignupValidator.validateName(nameInput.value);
    showFieldValidation("nameValidation", error);
  });

  // 전화번호 실시간 검사
  const phoneInputs = ["phone-prefix", "phone-middle", "phone-last"];
  phoneInputs.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("blur", () => {
      const phoneNumber = document.getElementById("phone_number").value;
      const error = SignupValidator.validatePhoneNumber(phoneNumber);
      showFieldValidation("phoneValidation", error);
    });
  });

  // 사업자 등록번호 실시간 검사
  const companyInput = document.getElementById("company_registration_number");
  if (companyInput) {
    companyInput.addEventListener("blur", () => {
      if (window.currentUserType === "seller") {
        const error = SignupValidator.validateCompanyRegistrationNumber(
          companyInput.value
        );
        showFieldValidation("companyValidation", error);
      }
    });
  }

  // 스토어 이름 실시간 검사
  const storeInput = document.getElementById("store_name");
  if (storeInput) {
    storeInput.addEventListener("blur", () => {
      if (window.currentUserType === "seller") {
        const error = SignupValidator.validateStoreName(storeInput.value);
        showFieldValidation("storeValidation", error);
      }
    });
  }
}

// 버튼 상태 관리 초기화
function initButtonStateManagement() {
  const requiredFields = [
    "username",
    "password",
    "confirmPassword",
    "name",
    "phone-middle",
    "phone-last",
  ];

  const agreementCheckbox = document.getElementById("agreement");

  // 모든 필드와 체크박스에 이벤트 리스너 추가
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("input", checkFormCompletion);
      field.addEventListener("blur", checkFormCompletion);
    }
  });

  // 전화번호 select도 추가
  const phonePrefix = document.getElementById("phone-prefix");
  if (phonePrefix) {
    phonePrefix.addEventListener("change", checkFormCompletion);
  }

  // 동의 체크박스
  if (agreementCheckbox) {
    agreementCheckbox.addEventListener("change", checkFormCompletion);
  }

  // 판매자 필드들
  const sellerFields = ["company_registration_number", "store_name"];
  sellerFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("input", checkFormCompletion);
      field.addEventListener("blur", checkFormCompletion);
    }
  });

  // 탭 변경 시에도 체크
  const buyerTab = document.getElementById("signup-buyer-tab");
  const sellerTab = document.getElementById("signup-seller-tab");
  if (buyerTab)
    buyerTab.addEventListener("click", () =>
      setTimeout(checkFormCompletion, 100)
    );
  if (sellerTab)
    sellerTab.addEventListener("click", () =>
      setTimeout(checkFormCompletion, 100)
    );
}

// 폼 완성도 체크 및 버튼 상태 업데이트
function checkFormCompletion() {
  const userType = window.currentUserType || "buyer";
  const signupBtn = document.getElementById("signupBtn");

  if (!signupBtn) return;

  // 1. 모든 필수 필드가 입력되었는지 확인
  const allFieldsFilled = checkAllFieldsFilled(userType);

  // 2. 모든 유효성 검사가 통과되었는지 확인
  const allValidationsPassed = checkAllValidationsPassed(userType);

  // 3. 동의 체크박스가 체크되었는지 확인
  const agreementChecked =
    document.getElementById("agreement")?.checked || false;

  // 모든 조건이 만족되면 버튼 활성화
  if (allFieldsFilled && allValidationsPassed && agreementChecked) {
    enableSignupButton(signupBtn);
  } else {
    disableSignupButton(signupBtn);
  }
}

// 모든 필수 필드가 입력되었는지 확인
function checkAllFieldsFilled(userType) {
  const commonFields = ["username", "password", "confirmPassword", "name"];
  const phoneFields = ["phone-middle", "phone-last"];

  // 공통 필드 체크
  for (const fieldId of commonFields) {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) {
      return false;
    }
  }

  // 전화번호 필드 체크
  for (const fieldId of phoneFields) {
    const field = document.getElementById(fieldId);
    if (!field || !field.value.trim()) {
      return false;
    }
  }

  // 판매자 필드 체크
  if (userType === "seller") {
    const sellerFields = ["company_registration_number", "store_name"];
    for (const fieldId of sellerFields) {
      const field = document.getElementById(fieldId);
      if (!field || !field.value.trim()) {
        return false;
      }
    }
  }

  return true;
}

// 모든 유효성 검사가 통과되었는지 확인
function checkAllValidationsPassed(userType) {
  const validationIds = [
    "usernameValidation",
    "passwordValidation",
    "confirmPasswordValidation",
    "nameValidation",
    "phoneValidation",
  ];

  if (userType === "seller") {
    validationIds.push("companyValidation", "storeValidation");
  }

  // 각 validation div에 에러가 있는지 확인
  for (const validationId of validationIds) {
    const validationDiv = document.getElementById(validationId);
    if (validationDiv && validationDiv.innerHTML.trim()) {
      if (
        validationDiv.innerHTML.includes("text-red") ||
        validationDiv.innerHTML.includes("error")
      ) {
        return false;
      }
    }
  }

  return true;
}

// 가입하기 버튼 활성화
function enableSignupButton(button) {
  button.disabled = false;
  button.className =
    "btn btn-primary w-full px-4 py-3 bg-[#21BF48] text-white rounded-md hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer";
}

// 가입하기 버튼 비활성화
function disableSignupButton(button) {
  button.disabled = true;
  button.className =
    "btn btn-primary w-full px-4 py-3 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed transition-colors duration-200";
}

// 필드 ID에 따른 validation ID 반환
function getValidationId(fieldId) {
  const validationMap = {
    username: "usernameValidation",
    password: "passwordValidation",
    confirmPassword: "confirmPasswordValidation",
    name: "nameValidation",
    "phone-middle": "phoneValidation",
    "phone-last": "phoneValidation",
    company_registration_number: "companyValidation",
    store_name: "storeValidation",
  };
  return validationMap[fieldId] || fieldId + "Validation";
}

// 이벤트 리스너 등록
function registerEventListeners(stateManager) {
  // 아이디 중복확인 이벤트
  document
    .getElementById("validateUsernameBtn")
    .addEventListener("click", () => handleUsernameValidation());

  // 폼 제출 이벤트
  document
    .getElementById("signupForm")
    .addEventListener("submit", e => handleSignup(e, stateManager));
}

// 필드별 유효성 검사 메시지 표시
function showFieldValidation(validationId, error) {
  const validationDiv = document.getElementById(validationId);
  if (validationDiv) {
    if (error) {
      validationDiv.innerHTML = createAlert(error, "error");
    } else {
      validationDiv.innerHTML = "";
    }
  }

  // 유효성 검사 후 버튼 상태 업데이트
  setTimeout(checkFormCompletion, 100);
}

// 필드 유효성 검사 메시지 제거
function clearFieldValidation(validationId) {
  const validationDiv = document.getElementById(validationId);
  if (validationDiv) {
    validationDiv.innerHTML = "";
  }
}

// 전체 에러 메시지 표시
function showSignupErrorMessage(message) {
  const errorContainer = document.getElementById("signup-error-container");
  const errorHTML = createAlert(message, "error");
  errorContainer.innerHTML = errorHTML;
}

// 전체 에러 메시지 숨김
function hideSignupErrorMessage() {
  const errorContainer = document.getElementById("signup-error-container");
  if (errorContainer) {
    errorContainer.innerHTML = "";
  }
}

// 동의하기 툴팁 표시
function showAgreementTooltip() {
  const agreementContainer = document.getElementById("agreement-container");
  const tooltip = document.getElementById("agreement-tooltip");

  if (!agreementContainer || !tooltip) {
    console.warn("동의하기 툴팁 요소를 찾을 수 없습니다.");
    return;
  }

  const rect = agreementContainer.getBoundingClientRect();

  tooltip.style.left = `${rect.left}px`;
  tooltip.style.top = `${rect.top - 45}px`;
  tooltip.classList.remove("hidden");

  setTimeout(() => {
    if (tooltip) {
      tooltip.classList.add("hidden");
    }
  }, 3000);
}

// 아이디 중복확인 처리
async function handleUsernameValidation() {
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value.trim();
  const validationDiv = document.getElementById("usernameValidation");

  // 클라이언트 측 유효성 검사
  const error = SignupValidator.validateUsername(username);
  if (error) {
    validationDiv.innerHTML = createAlert(error, "error");
    return;
  }

  try {
    // 서버 측 중복 검사
    validationDiv.innerHTML = createAlert(MESSAGES.LOADING.VALIDATING, "info");

    const response = await AuthAPI.validateUsername(username);
    const message = response.message || MESSAGES.SUCCESS.USERNAME_AVAILABLE;

    validationDiv.innerHTML = createAlert(message, "success");
  } catch (error) {
    validationDiv.innerHTML = createAlert(error.message, "error");
  }
}

// 회원가입 처리
async function handleSignup(e, stateManager) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const userType = window.currentUserType || "buyer";

  // 동의하기 체크 확인
  const agreementCheckbox = document.getElementById("agreement");
  if (!agreementCheckbox || !agreementCheckbox.checked) {
    if (agreementCheckbox) {
      agreementCheckbox.focus();
    }
    showAgreementTooltip();
    return;
  }

  const userData = {
    username: formData.get("username").trim(),
    password: formData.get("password"),
    name: formData.get("name").trim(),
    phone_number: formData.get("phone_number").trim(),
  };

  if (userType === "seller") {
    userData.company_registration_number = formData
      .get("company_registration_number")
      .trim();
    userData.store_name = formData.get("store_name").trim();
  }

  // 모든 필드 유효성 검사
  const validationResults = validateAllFields(userData, formData, userType);

  if (validationResults.hasError) {
    showSignupErrorMessage("입력 정보를 확인해주세요.");
  }

  try {
    hideSignupErrorMessage();

    // 회원가입 API 호출
    let response;
    if (userType === "buyer") {
      response = await AuthAPI.signupBuyer(userData);
    } else {
      response = await AuthAPI.signupSeller(userData);
    }

    alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");

    // 로그인 페이지로 이동
    window.router.navigate("/login");
  } catch (error) {
    handleSignupError(error);
  }
}

// 모든 필드 유효성 검사
function validateAllFields(userData, formData, userType) {
  let hasError = false;

  // 아이디 검사
  const usernameError = SignupValidator.validateUsername(userData.username);
  showFieldValidation("usernameValidation", usernameError);
  if (usernameError) hasError = true;

  // 비밀번호 검사
  const passwordError = SignupValidator.validatePassword(userData.password);
  showFieldValidation("passwordValidation", passwordError);
  if (passwordError) hasError = true;

  // 비밀번호 확인 검사
  const passwordMatchError = SignupValidator.validatePasswordMatch(
    userData.password,
    formData.get("confirmPassword")
  );
  showFieldValidation("confirmPasswordValidation", passwordMatchError);
  if (passwordMatchError) hasError = true;

  // 이름 검사
  const nameError = SignupValidator.validateName(userData.name);
  showFieldValidation("nameValidation", nameError);
  if (nameError) hasError = true;

  // 전화번호 검사
  const phoneError = SignupValidator.validatePhoneNumber(userData.phone_number);
  showFieldValidation("phoneValidation", phoneError);
  if (phoneError) hasError = true;

  // 판매자 필드 검사
  if (userType === "seller") {
    const companyError = SignupValidator.validateCompanyRegistrationNumber(
      userData.company_registration_number
    );
    showFieldValidation("companyValidation", companyError);
    if (companyError) hasError = true;

    const storeError = SignupValidator.validateStoreName(userData.store_name);
    showFieldValidation("storeValidation", storeError);
    if (storeError) hasError = true;
  }

  return { hasError };
}

// 회원가입 에러 처리
function handleSignupError(error) {
  const errorMessage = error.message;

  // 전화번호 패턴 체크 (010으로 시작하는 11자리 숫자)
  const phonePattern = /^01[0-9]{9}$/;
  if (phonePattern.test(errorMessage.trim())) {
    showFieldValidation("phoneValidation", "이미 사용중인 전화번호입니다.");
    return;
  }

  // 필드별 키워드 매핑
  const fieldErrorMap = [
    {
      keywords: ["아이디", "username", "사용자"],
      validationId: "usernameValidation",
    },
    {
      keywords: ["전화번호", "phone", "핸드폰", "휴대폰"],
      validationId: "phoneValidation",
    },
    {
      keywords: ["사업자", "company", "등록번호"],
      validationId: "companyValidation",
    },
    {
      keywords: ["스토어", "store", "상점"],
      validationId: "storeValidation",
    },
    {
      keywords: ["비밀번호", "password"],
      validationId: "passwordValidation",
    },
    {
      keywords: ["이름", "name"],
      validationId: "nameValidation",
    },
  ];

  // 에러 메시지를 기반으로 적절한 필드 찾기
  for (const fieldError of fieldErrorMap) {
    const hasKeyword = fieldError.keywords.some(keyword =>
      errorMessage.toLowerCase().includes(keyword.toLowerCase())
    );

    if (hasKeyword) {
      showFieldValidation(fieldError.validationId, errorMessage);
      return;
    }
  }

  // 특정 필드와 매치되지 않으면 전체 에러로 표시
  showSignupErrorMessage(errorMessage || MESSAGES.ERROR.SIGNUP_FAILED);
}
