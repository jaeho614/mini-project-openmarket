export class Modal {
  static show(title, content, onConfirm = null) {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${
                      onConfirm
                        ? '<button class="btn btn-primary modal-confirm">확인</button>'
                        : ""
                    }
                    <button class="btn btn-secondary modal-cancel">취소</button>
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

    return modal;
  }

  static alert(message) {
    return this.show("알림", `<p>${message}</p>`);
  }

  static confirm(message, onConfirm) {
    return this.show("확인", `<p>${message}</p>`, onConfirm);
  }
}
