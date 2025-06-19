import { SecurityUtils } from "../utils/security.js";

export function createInput(
  id,
  label,
  type = "text",
  placeholder = "",
  required = false
) {
  return `
        <div class="form-group">
            <label for="${id}">
                ${label} ${required ? '<span style="color: red;">*</span>' : ""}
            </label>
            <input 
                type="${type}" 
                id="${id}" 
                name="${id}"
                placeholder="${placeholder}"
                class="form-control"
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

export function createButton(
  text,
  type = "button",
  className = "btn btn-primary",
  disabled = false
) {
  return `
        <button 
            type="${type}" 
            class="${className}"
            ${disabled ? "disabled" : ""}
        >
            ${text}
        </button>
    `;
}
