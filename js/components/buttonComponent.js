export function createButton(
  text,
  type = "button",
  px,
  py,
  className = "btn",
  disabled = false
) {
  return `
        <button 
            type="${type}" 
            class="${className} w-full px-${px} py-${py} bg-[#21BF48] text-white rounded-md hover:opacity-80  focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
            ${disabled ? "disabled" : ""}
        >
            ${text}
        </button>
    `;
}
