import { SecurityUtils } from "../utils/security.js";

// signup page input
export function createSingUpInput(id, label, type = "text", required = false) {
  return `
    <div class="form-group">
      <label for="${id}">
        ${required ? '<span class="text-red-500">*</span>' : ""} ${label}
      </label>
      <input 
        type="${type}" 
        id="${id}" 
        name="${id}"
        class="form-control mt-[10px]"
        ${required ? "required" : ""}
			/>
    </div>
  `;
}

// signup page password input
export function createSingUpPasswordInput(
  id,
  label,
  type = "text",
  required = false
) {
  return `
    <div class="form-group">
      <label for="${id}">
        ${required ? '<span class="text-red-500">*</span>' : ""} ${label}
      </label>
      <div class="relative">
        <input 
          type="${type}" 
          id="${id}" 
          name="${id}"
          class="form-control mt-[10px]"
          ${required ? "required" : ""}
        />
				<div id="${id}-check-icon" class="absolute right-3 top-[33px] transform -translate-y-1/2 hidden">
					<img src="./assets/icons/icon-check-on.svg" alt="비밀번호 확인" class="w-6 h-6" />
				</div>
      </div>
    </div>
  `;
}

// login page input
export function createLoginInput(
  id,
  label,
  type = "text",
  placeholder = "",
  required = false
) {
  return `
  	<div class="form-group">
      <label class="sr-only" for="${id}">
        ${label}
      </label>
      <input 
        type="${type}" 
        id="${id}" 
        name="${id}"
        placeholder="${placeholder}"
        class="w-full px-4 py-3 border-0 border-b border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        ${required ? "required" : ""}
      />
    </div>
  `;
}

// alert
export function createAlert(message, type = "error") {
  const className = type === "error" ? "alert-error" : "alert-success";
  return `
    <div class="alert ${className}">
      ${SecurityUtils.sanitizeInput(message)}
    </div>
    `;
}

// 회원가입 버튼
export function createActionButton(
  id,
  text,
  type = "button",
  px,
  py,
  className = "btn",
  disabled = false
) {
  return `
    <button 
      id="${id}"
      type="${type}" 
      class="${className} w-full px-${px} py-${py} bg-[#21BF48] text-white rounded-md hover:opacity-80  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
      ${disabled ? "disabled" : ""}
    >
      ${text}
    </button>
  `;
}
