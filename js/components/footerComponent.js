export function createFooter() {
  return `
        <footer class="bg-gray-100 border-t border-gray-200 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
        <!-- 상단 링크 섹션 -->
        <div class="flex flex-wrap justify-center items-center gap-1 text-sm text-gray-600 mb-6">
          <a href="#" class="hover:text-gray-900 transition-colors">호두넛 소개</a>
          <span class="text-gray-400">|</span>
          <a href="#" class="hover:text-gray-900 transition-colors">이용약관</a>
          <span class="text-gray-400">|</span>
          <a href="#" class="hover:text-gray-900 transition-colors">개인정보처리방침</a>
          <span class="text-gray-400">|</span>
          <a href="#" class="hover:text-gray-900 transition-colors">전자금융거래약관</a>
          <span class="text-gray-400">|</span>
          <a href="#" class="hover:text-gray-900 transition-colors">청소년보호정책</a>
          <span class="text-gray-400">|</span>
          <a href="#" class="hover:text-gray-900 transition-colors">제휴문의</a>
        </div>

        <!-- 회사 정보 섹션 -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center">

          <!-- 회사 정보 -->
          <div class="text-sm text-gray-600 space-y-1 mb-4 lg:mb-0">
            <div class="font-semibold text-gray-800">(주)HODU SHOP</div>
            <div>제주특별자치도 제주시 동광로 137 제주코리아마이스하우스</div>
            <div>사업자 번호: 000-0000-0000 | 통신판매업</div>
            <div>대표: 김호두</div>
          </div>

          <!-- 소셜 미디어 아이콘 -->
          <div class="flex gap-3">

            <!-- Instagram -->
            <a href="#" class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center hover:opacity-80 transition-colors">
                <img src="./assets/icons/icon-insta.svg" alt="" />
            </a>

            <!-- Facebook -->
            <a href="#" class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center hover:opacity-80 transition-colors">
              <img src="./assets/icons/icon-fb.svg" alt="" />
            </a>

            <!-- YouTube -->
            <a href="#" class="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center hover:opacity-80 transition-colors">
              <img src="./assets/icons/icon-yt.svg" alt="" />
            </a>
          </div>
        </div>
      </div>
    `;
}

export function attachFooterEvents() {
  document.querySelectorAll("footer a").forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      const text = link.textContent.trim();

      if (href === "#" && text) {
        e.preventDefault();
        alert(`"${text}" 페이지는 준비 중입니다.`);
      }
    });
  });
}
