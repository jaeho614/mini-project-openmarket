import { createHeader } from "../components/headerComponent.js";
import {
  createFooter,
  attachFooterEvents,
} from "../components/footerComponent.js";
import { createInput, createAlert } from "../components/formComponent.js";
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

  const { loading, error } = stateManager.state;

  document.getElementById("app").innerHTML = `
        ${createHeader(stateManager)}
        <main class="container">
            <div class="card" style="max-width: 400px; margin: 0 auto;">
                <h2 class="text-center mb-20">로그인</h2>
                
                ${error ? createAlert(error, "error") : ""}
                
                <form id="loginForm">
                    ${createInput(
                      "username",
                      "아이디",
                      "text",
                      "아이디를 입력하세요",
                      true
                    )}
                    ${createInput(
                      "password",
                      "비밀번호",
                      "password",
                      "비밀번호를 입력하세요",
                      true
                    )}
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;" ${
                      loading ? "disabled" : ""
                    }>
                        ${loading ? MESSAGES.LOADING.LOGIN : "로그인"}
                    </button>
                </form>
                
                <div class="text-center mt-20">
                    <p>
                        계정이 없으신가요? 
                        <a href="#/signup">회원가입</a>
                    </p>
                </div>
            </div>
        </main>
        ${createFooter()}
    `;

  document
    .getElementById("loginForm")
    .addEventListener("submit", e => handleLogin(e, stateManager));
  attachFooterEvents();
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
    stateManager.setError(usernameError);
    return;
  }

  if (passwordError) {
    stateManager.setError(passwordError);
    return;
  }

  try {
    stateManager.setLoading(true);
    stateManager.clearError();

    const response = await AuthAPI.login(credentials);

    AuthManager.setTokens(response.access, response.refresh);
    AuthManager.setUser(response.user);

    stateManager.setUser(response.user);

    window.router.navigate("/");
  } catch (error) {
    stateManager.setError(error.message);
  } finally {
    stateManager.setLoading(false);
  }
}
