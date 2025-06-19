import { attachFooterEvents } from "../components/footerComponent.js";
import { createInput, createAlert } from "../components/formComponent.js";
import { AuthAPI } from "../api/auth.js";
import { AuthManager } from "../utils/auth.js";
import { Validator } from "../utils/validation.js";
import { MESSAGES } from "../constants/messages.js";

export function SignupPage(stateManager) {
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
        <main class="container">
            <div class="card" style="max-width: 600px; margin: 0 auto;">
                <h2 class="text-center mb-20">회원가입</h2>
                <div class="form-group">
                    <label>회원 유형 선택 <span style="color: red;">*</span></label>
                    <div class="grid grid-2">
                        <label>
                            <input type="radio" name="userType" value="buyer" checked>
                            구매자 - 상품을 구매합니다
                        </label>
                        <label>
                            <input type="radio" name="userType" value="seller">
                            판매자 - 상품을 판매합니다
                        </label>
                    </div>
                </div>
                
                <form id="signupForm">
                    <div id="commonFields">
                        <div style="display: flex; gap: 10px;">
                            <div style="flex: 1;">
                                ${createInput(
                                  "username",
                                  "아이디",
                                  "text",
                                  "아이디를 입력하세요",
                                  true
                                )}
                            </div>
                            <button type="button" id="validateUsernameBtn" class="btn btn-secondary" style="margin-top: 30px; height: fit-content;">
                                중복확인
                            </button>
                        </div>
                        <div id="usernameValidation"></div>
                        
                        ${createInput(
                          "password",
                          "비밀번호",
                          "password",
                          "비밀번호를 입력하세요",
                          true
                        )}
                        ${createInput(
                          "confirmPassword",
                          "비밀번호 확인",
                          "password",
                          "비밀번호를 다시 입력하세요",
                          true
                        )}
                        ${createInput(
                          "name",
                          "이름",
                          "text",
                          "이름을 입력하세요",
                          true
                        )}
                        ${createInput(
                          "phone_number",
                          "전화번호",
                          "tel",
                          "010XXXXXXXX",
                          true
                        )}
                    </div>
                    
                    <div id="sellerFields" style="display: none;">
                        ${createInput(
                          "company_registration_number",
                          "사업자등록번호",
                          "text",
                          "사업자등록번호를 입력하세요",
                          false
                        )}
                        ${createInput(
                          "store_name",
                          "상점명",
                          "text",
                          "상점명을 입력하세요",
                          false
                        )}
                    </div>
                    <div id="signup-error-container" class="error-space"></div>
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        회원가입
                    </button>
                </form>
                
                <div class="text-center mt-20">
                    <p>
                        이미 계정이 있으신가요? 
                        <a href="#/login">로그인</a>
                    </p>
                </div>
            </div>
        </main>
    `;

  document.querySelectorAll('input[name="userType"]').forEach(radio => {
    radio.addEventListener("change", handleUserTypeChange);
  });

  document
    .getElementById("validateUsernameBtn")
    .addEventListener("click", () => handleUsernameValidation(stateManager));
  document
    .getElementById("signupForm")
    .addEventListener("submit", e => handleSignup(e, stateManager));

  handleUserTypeChange({ target: { value: "buyer" } });
  attachFooterEvents();
}

// SignupPage용 에러 메시지 표시 함수
function showSignupErrorMessage(message) {
  const errorContainer = document.getElementById("signup-error-container");
  const errorHTML = createAlert(message, "error");
  errorContainer.innerHTML = errorHTML;
}

function hideSignupErrorMessage() {
  const errorContainer = document.getElementById("signup-error-container");
  if (errorContainer) {
    errorContainer.innerHTML = "";
  }
}

function handleUserTypeChange(e) {
  const sellerFields = document.getElementById("sellerFields");
  const companyInput = document.getElementById("company_registration_number");
  const storeInput = document.getElementById("store_name");
  const companyLabel = companyInput.previousElementSibling;
  const storeLabel = storeInput.previousElementSibling;

  if (e.target.value === "seller") {
    sellerFields.style.display = "block";
    companyInput.setAttribute("required", "");
    storeInput.setAttribute("required", "");
    companyLabel.innerHTML =
      '사업자등록번호 <span style="color: red;">*</span>';
    storeLabel.innerHTML = '상점명 <span style="color: red;">*</span>';
  } else {
    sellerFields.style.display = "none";
    companyInput.removeAttribute("required");
    storeInput.removeAttribute("required");
    companyLabel.innerHTML = "사업자등록번호";
    storeLabel.innerHTML = "상점명";
  }
}

async function handleUsernameValidation(stateManager) {
  const usernameInput = document.getElementById("username");
  const username = usernameInput.value.trim();
  const validationDiv = document.getElementById("usernameValidation");

  const error = Validator.validateUsername(username);
  if (error) {
    validationDiv.innerHTML = createAlert(error, "error");
    return;
  }

  try {
    const response = await AuthAPI.validateUsername(username);
    validationDiv.innerHTML = createAlert(response.message, "success");
  } catch (error) {
    validationDiv.innerHTML = createAlert(error.message, "error");
  }
}

async function handleSignup(e, stateManager) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const userType = document.querySelector(
    'input[name="userType"]:checked'
  ).value;

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

  const usernameError = Validator.validateUsername(userData.username);
  if (usernameError) {
    showSignupErrorMessage(usernameError);
    return;
  }

  const passwordError = Validator.validatePassword(userData.password);
  if (passwordError) {
    showSignupErrorMessage(passwordError);
    return;
  }

  const passwordMatchError = Validator.validatePasswordMatch(
    userData.password,
    formData.get("confirmPassword")
  );
  if (passwordMatchError) {
    showSignupErrorMessage(passwordMatchError);
    return;
  }

  const nameError = Validator.validateName(userData.name);
  if (nameError) {
    showSignupErrorMessage(nameError);
    return;
  }

  const phoneError = Validator.validatePhoneNumber(userData.phone_number);
  if (phoneError) {
    showSignupErrorMessage(phoneError);
    return;
  }

  if (userType === "seller") {
    const companyError = Validator.validateCompanyRegistrationNumber(
      userData.company_registration_number
    );
    if (companyError) {
      showSignupErrorMessage(companyError);
      return;
    }

    const storeError = Validator.validateStoreName(userData.store_name);
    if (storeError) {
      showSignupErrorMessage(storeError);
      return;
    }
  }

  try {
    hideSignupErrorMessage();

    let response;
    if (userType === "buyer") {
      response = await AuthAPI.signupBuyer(userData);
    } else {
      response = await AuthAPI.signupSeller(userData);
    }

    // 자동 로그인
    const loginResponse = await AuthAPI.login({
      username: userData.username,
      password: userData.password,
    });

    AuthManager.setTokens(loginResponse.access, loginResponse.refresh);
    AuthManager.setUser(loginResponse.user);
    stateManager.setUser(loginResponse.user);

    window.router.navigate("#/");
  } catch (error) {
    showSignupErrorMessage(error.message);
  }
}
