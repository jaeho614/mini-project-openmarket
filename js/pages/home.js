import { createHeader } from "../components/headerComponent.js";
import {
  createFooter,
  attachFooterEvents,
} from "../components/footerComponent.js";
import { SecurityUtils } from "../utils/security.js";

export function HomePage(stateManager) {
  const { isAuthenticated, user } = stateManager.state;

  document.getElementById("app").innerHTML = `
        ${createHeader(stateManager)}
        <main class="container">
            <div class="card text-center">
                <h2>오픈마켓에 오신 것을 환영합니다</h2>
                ${
                  isAuthenticated
                    ? `
                    <p>안녕하세요, ${SecurityUtils.sanitizeInput(
                      user.name
                    )}님!</p>
                    <button onclick="window.router.navigate('/mypage')" class="btn btn-primary">
                        마이페이지로 이동
                    </button>
                `
                    : `
                    <p>다양한 상품을 만나보세요</p>
                    <div>
                        <button onclick="window.router.navigate('/login')" class="btn btn-primary">
                            로그인
                        </button>
                        <button onclick="window.router.navigate('/signup')" class="btn btn-secondary">
                            회원가입
                        </button>
                    </div>
                `
                }
            </div>
        </main>
        ${createFooter()}
    `;

  attachFooterEvents();
}
