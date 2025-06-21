import { createHeader } from "../components/headerComponent.js";
import { AuthManager } from "../utils/auth.js";
import { SecurityUtils } from "../utils/security.js";
import { MESSAGES } from "../constants/messages.js";

export function MyPage(stateManager) {
  if (!AuthManager.isAuthenticated()) {
    alert(MESSAGES.ERROR.LOGIN_REQUIRED);
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + "#/login"
    );

    window.router.currentRoute = "/login";

    setTimeout(() => {
      window.router.handleRoute();
    }, 0);

    return;
  }

  const { user } = stateManager.state;
  console.log(user);

  document.getElementById("app").innerHTML = `
        ${createHeader(stateManager)}
        <main class="container">
            <div class="card">
                <h3>마이페이지</h3>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4>사용자 정보</h4>
                    <div class="grid grid-2">
                        <div>
                            <strong>아이디:</strong> ${SecurityUtils.sanitizeInput(
                              user.username
                            )}
                        </div>
                        <div>
                            <strong>이름:</strong> ${SecurityUtils.sanitizeInput(
                              user.name
                            )}
                        </div>
                        <div>
                            <strong>전화번호:</strong> ${SecurityUtils.sanitizeInput(
                              user.phone_number
                            )}
                        </div>
                        <div>
                            <strong>회원 유형:</strong> 
                            <span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; ${
                              user.user_type === "BUYER"
                                ? "background: #e3f2fd; color: #1976d2;"
                                : "background: #e8f5e8; color: #2e7d32;"
                            }">
                                ${
                                  user.user_type === "BUYER"
                                    ? "구매자"
                                    : "판매자"
                                }
                            </span>
                        </div>
                        ${
                          user.user_type === "SELLER"
                            ? `
                            <div>
                                <strong>사업자등록번호:</strong> ${SecurityUtils.sanitizeInput(
                                  user.company_registration_number || ""
                                )}
                            </div>
                            <div>
                                <strong>상점명:</strong> ${SecurityUtils.sanitizeInput(
                                  user.store_name || ""
                                )}
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
                
                <div>
                    <h4>${
                      user.user_type === "BUYER" ? "구매자 기능" : "판매자 기능"
                    }</h4>
                    <div class="grid grid-3">
                        ${
                          user.user_type === "BUYER"
                            ? `
                            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px;">
                                <h5>상품 검색</h5>
                                <p>원하는 상품을 찾아보세요</p>
                                <button class="btn btn-primary">바로가기 →</button>
                            </div>
                            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px;">
                                <h5>장바구니</h5>
                                <p>담아둔 상품을 확인하세요</p>
                                <button class="btn btn-primary">바로가기 →</button>
                            </div>
                            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px;">
                                <h5>주문내역</h5>
                                <p>구매한 상품을 관리하세요</p>
                                <button class="btn btn-primary">바로가기 →</button>
                            </div>
                        `
                            : `
                            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px;">
                                <h5>상품 관리</h5>
                                <p>상품을 등록하고 관리하세요</p>
                                <button class="btn btn-primary">바로가기 →</button>
                            </div>
                            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px;">
                                <h5>주문 관리</h5>
                                <p>들어온 주문을 처리하세요</p>
                                <button class="btn btn-primary">바로가기 →</button>
                            </div>
                            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px;">
                                <h5>매출 현황</h5>
                                <p>매출 통계를 확인하세요</p>
                                <button class="btn btn-primary">바로가기 →</button>
                            </div>
                        `
                        }
                    </div>
                </div>
            </div>
        </main>
    `;
}
