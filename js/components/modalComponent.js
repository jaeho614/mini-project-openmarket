export class loginRequestModal {
  static show(content, onConfirm = null) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]";
    modal.innerHTML = `
            <div class="w-[360px] h-[200px] bg-white rounded-lg shadow-xl relative flex flex-col justify-between items-center" style="padding: 50px 75px 40px 75px;">

                <!-- X 버튼 -->
                <button class="modal-close absolute top-4 right-4 bg-transparent border-none cursor-pointer p-1">
                    <img src="../../assets/icons/icon-delete.svg" alt="닫기" class="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity duration-200">
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
      `<p>로그인이 필요한 서비스입니다.</p>
      <p>로그인 하시겠습니까?</p>`,
      onConfirm
    );
  }
}
