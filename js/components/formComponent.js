import { SecurityUtils } from "../utils/security.js";

export function createSingUpInput(id, label, type = "text", required = false) {
  return `
        <div class="form-group">
            <label for="${id}">
                ${required ? '<span style="color: red;">*</span>' : ""} ${label}
            </label>
            <input 
                type="${type}" 
                id="${id}" 
                name="${id}"
                class="form-control mt-[10px]"
                ${required ? "required" : ""}
            >
        </div>
    `;
}

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
            >
        </div>
    `;
}

export function createAlert(message, type = "error") {
  const className = type === "error" ? "alert-error" : "alert-success";
  return `
        <div class="alert ${className}">
            ${SecurityUtils.sanitizeInput(message)}
        </div>
    `;
}

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
