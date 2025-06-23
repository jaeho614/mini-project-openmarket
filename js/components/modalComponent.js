export class loginRequestModal {
  static show(content, onConfirm = null) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]";
    modal.innerHTML = `
      <div class="w-[360px] h-[200px] bg-white rounded-lg shadow-xl relative flex flex-col justify-between items-center" style="padding: 50px 75px 40px 75px;">

        <!-- X 버튼 -->
        <button class="modal-close absolute top-4 right-4 bg-transparent border-none cursor-pointer p-1">
          <img src="./assets/icons/icon-delete.svg" alt="닫기" class="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity duration-200">
        </button>

        <!-- 모달 텍스트 -->
        <div class="modal-text text-center text-gray-800 text-sm leading-6 mb-5">
          ${content}
        </div>

        <!-- 버튼 컨테이너 -->
        <div class="flex gap-4">
          <button class="modal-cancel w-[100px] h-10 rounded border border-gray-300 bg-white text-gray-600 text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-400">
            아니오
          </button>
          ${
            onConfirm
              ? '<button class="modal-confirm w-[100px] h-10 rounded bg-green-500 text-white text-sm font-medium cursor-pointer transition-all duration-200 hover:bg-green-600">예</button>'
              : ""
          }
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      document.body.removeChild(modal);
    };

    modal.querySelector(".modal-close").addEventListener("click", close);
    modal.querySelector(".modal-cancel").addEventListener("click", close);

    if (onConfirm) {
      modal.querySelector(".modal-confirm").addEventListener("click", () => {
        onConfirm();
        close();
      });
    }

    modal.addEventListener("click", e => {
      if (e.target === modal) close();
    });

    // ESC 키로 모달 닫기
    const handleEscape = e => {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);

    return modal;
  }

  static alert(message) {
    return this.show("알림", `${message}`);
  }

  static confirm(message, onConfirm) {
    return this.show("확인", `${message}`, onConfirm);
  }

  // 로그인 모달 전용 메서드
  static loginConfirm(onConfirm) {
    return this.show(
      `
        <p>로그인이 필요한 서비스입니다.</p>
        <p>로그인 하시겠습니까?</p>
      `,
      onConfirm
    );
  }
}

export class MyPageModal {
  static show(targetElement) {
    // 기존 모달이 있으면 제거
    const existingModal = document.querySelector(".mypage-modal");
    if (existingModal) {
      existingModal.remove();
      return;
    }

    const modal = document.createElement("div");
    modal.className = "mypage-modal fixed z-[1000]";

    // 타겟 요소의 위치 계산
    const rect = targetElement.getBoundingClientRect();
    const modalWidth = 160;
    const modalHeight = 120;

    // 마이페이지 버튼 아래쪽에 위치
    const left = rect.left + rect.width / 2 - modalWidth / 2;
    const top = rect.bottom + 8;

    modal.style.left = `${left}px`;
    modal.style.top = `${top}px`;

    modal.innerHTML = `
      <div class="relative bg-red-300 rounded-lg shadow-lg border border-gray-200" style="width: ${modalWidth}px; min-height: ${modalHeight}px;">
        <!-- 위쪽을 향한 말풍선 꼬리 -->
        <div class="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div class="w-4 h-4 bg-red-300 border-l border-t border-gray-200 transform rotate-45"></div>
        </div>
        
        <!-- 모달 콘텐츠 -->
        <div class="p-4 pt-6">
          <!-- 마이페이지 메뉴 -->
          <div class="space-y-3">
            <a href="#/mypage" class="mypage-menu-item w-full text-left text-sm text-gray-700 hover:text-green-600 hover:bg-gray-50 px-2 py-2 rounded transition-colors flex items-center">마이페이지</a>
            <div class="border-t border-gray-200 pt-2">
              <button id="logout-btn" class="w-full text-left text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-2 rounded transition-colors flex items-center">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 이벤트 리스너 등록
    const setupEventListeners = () => {
      // 로그아웃 버튼 클릭 이벤트
      const logoutBtn = modal.querySelector("#logout-btn");
      logoutBtn.addEventListener("click", () => {
        this.close();

        // 로그아웃 처리
        if (window.handleLogoutAndReload) {
          window.handleLogoutAndReload();
        }
      });

      // 모달 외부 클릭 시 닫기
      const closeOnOutsideClick = e => {
        if (!modal.contains(e.target) && !targetElement.contains(e.target)) {
          this.close();
        }
      };

      // ESC 키로 모달 닫기
      const handleEscape = e => {
        if (e.key === "Escape") {
          this.close();
        }
      };

      // 이벤트 리스너 등록
      setTimeout(() => {
        document.addEventListener("click", closeOnOutsideClick);
        document.addEventListener("keydown", handleEscape);
      }, 100);

      // 모달 제거 시 이벤트 리스너도 제거
      modal.addEventListener("modal-cleanup", () => {
        document.removeEventListener("click", closeOnOutsideClick);
        document.removeEventListener("keydown", handleEscape);
      });
    };

    setupEventListeners();
    return modal;
  }

  static close() {
    const modal = document.querySelector(".mypage-modal");
    if (modal) {
      modal.dispatchEvent(new CustomEvent("modal-cleanup"));
      modal.remove();
    }
  }

  static toggle(targetElement) {
    const existingModal = document.querySelector(".mypage-modal");
    if (existingModal) {
      this.close();
    } else {
      this.show(targetElement);
    }
  }
}

window.handleLogoutAndReload = function () {
  window.handleLogout();

  setTimeout(() => {
    window.stateManager.forceNotify();
  }, 100);
};
