export function createFooter() {
  const currentYear = new Date().getFullYear();

  return `
        <footer style="background: #f8f9fa; border-top: 1px solid #dee2e6; margin-top: 40px;">
            <div class="container" style="padding: 40px 20px;">
                <div class="grid grid-3">
                    <div>
                        <h4 style="margin-bottom: 15px; color: #333;">오픈마켓</h4>
                        <p style="color: #666; line-height: 1.6;">
                            다양한 상품을 한 곳에서 만나보세요.<br>
                            구매자와 판매자 모두에게<br>
                            최고의 경험을 제공합니다.
                        </p>
                    </div>
                    
                    <div>
                        <h5 style="margin-bottom: 15px; color: #333;">고객 서비스</h5>
                        <ul style="list-style: none; padding: 0; line-height: 2;">
                            <li><a href="#" style="color: #666; text-decoration: none;">공지사항</a></li>
                            <li><a href="#" style="color: #666; text-decoration: none;">자주 묻는 질문</a></li>
                            <li><a href="#" style="color: #666; text-decoration: none;">고객센터</a></li>
                            <li><a href="#" style="color: #666; text-decoration: none;">배송 안내</a></li>
                            <li><a href="#" style="color: #666; text-decoration: none;">환불/교환</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h5 style="margin-bottom: 15px; color: #333;">회사 정보</h5>
                        <ul style="list-style: none; padding: 0; line-height: 2;">
                            <li><a href="#" style="color: #666; text-decoration: none;">회사 소개</a></li>
                            <li><a href="#" style="color: #666; text-decoration: none;">이용약관</a></li>
                            <li><a href="#" style="color: #666; text-decoration: none;">개인정보처리방침</a></li>
                            <li><a href="#" style="color: #666; text-decoration: none;">판매자 입점</a></li>
                            <li><a href="#" style="color: #666; text-decoration: none;">광고 문의</a></li>
                        </ul>
                    </div>
                </div>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
                    <div style="color: #666; font-size: 14px;">
                        <p style="margin: 0;">
                            © ${currentYear} 오픈마켓. All rights reserved.
                        </p>
                        <p style="margin: 5px 0 0 0; font-size: 12px;">
                            서울특별시 강남구 테헤란로 123 | 대표전화: 1588-1234 | 이메일: support@openmarket.com
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 15px;">
                        <a href="#" style="color: #666; text-decoration: none; font-size: 14px;">Facebook</a>
                        <a href="#" style="color: #666; text-decoration: none; font-size: 14px;">Instagram</a>
                        <a href="#" style="color: #666; text-decoration: none; font-size: 14px;">Twitter</a>
                        <a href="#" style="color: #666; text-decoration: none; font-size: 14px;">YouTube</a>
                    </div>
                </div>
            </div>
        </footer>
    `;
}

export function attachFooterEvents() {
  document.querySelectorAll("footer a").forEach(link => {
    link.addEventListener("click", e => {
      if (link.getAttribute("href") === "#") {
        e.preventDefault();
        console.log("준비 중인 페이지입니다.");

        const linkText = link.textContent;
        alert(`"${linkText}" 페이지는 준비 중입니다.`);
      }
    });
  });
}
