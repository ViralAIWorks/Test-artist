import React from "react";
import { Credit, SubpageHero, SubpageNav } from "../components/SiteLayout.jsx";
import content from "../data/content.json";

function InterestsPage() {
  const page = content.pages.interests;
  return (
    <main className="wrap subpage">
      <SubpageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />
      <SubpageNav activePage="/interests.html" />
      <div className="subpage-content">
        <div className="feature">
          <div className="feature-photo">
            <img
              src="https://i.pinimg.com/1200x/01/5b/0b/015b0b233679bc193ce8e73d0fc52495.jpg"
              alt="Karina xuất hiện trước buổi ghi hình Knowing Bros năm 2023"
              loading="lazy"
            />
          </div>
          <div className="feature-copy">
            <span className="tag">Một lát cắt đời thường</span>
            <h3>Thoải mái trước ống kính</h3>
            <p>
              Ngoài concept sân khấu, các chương trình giải trí cho thấy một nhịp điệu gần gũi
              hơn: trò chuyện, ứng biến và tương tác cùng những người xung quanh.
            </p>
            <Credit>
              Ảnh: K-POPIT / Wikimedia Commons ·{" "}
              <a
                href="https://commons.wikimedia.org/wiki/File:230601_Karina_(aespa).jpg"
                target="_blank"
                rel="noreferrer"
              >
                CC BY 3.0
              </a>
            </Credit>
          </div>
        </div>
        <div className="interests">
          <article className="interest">
            <div className="icon" aria-hidden="true">♫</div>
            <h3>Từ hip-hop đến jazz</h3>
            <p>
              Hip-hop là thể loại cô xem là chất liệu chính; R&amp;B và jazz là những màu âm
              nhạc cô muốn khám phá thêm.
            </p>
          </article>
          <article className="interest">
            <div className="icon" aria-hidden="true">✦</div>
            <h3>Hình mẫu âm nhạc</h3>
            <p>
              Girls’ Generation và Camila Cabello là hai nghệ sĩ Karina từng nhắc đến như
              nguồn cảm hứng.
            </p>
          </article>
          <article className="interest">
            <div className="icon" aria-hidden="true">◎</div>
            <h3>Tham gia vào khâu sáng tạo</h3>
            <p>
              Với sân khấu solo, cô góp sức từ lời ca và vũ đạo đến trang phục, chỉ đạo sân
              khấu và cách đặt máy quay.
            </p>
          </article>
        </div>
        <div className="section-head">
          <div>
            <div className="eyebrow">Từ âm nhạc đến truyền hình</div>
            <h2>Một hành trình không ngừng mở rộng</h2>
          </div>
          <p>
            Không chỉ trình diễn,
            <br />
            mà còn định hình cách kể chuyện.
          </p>
        </div>
        <div className="intro-panel">
          <h3>Đằng sau ánh đèn sân khấu</h3>
          <p>
            Những sở thích và lựa chọn sáng tạo này gặp nhau ở sự biến hóa: Karina có thể
            chuyển từ năng lượng mạnh trên sân khấu sang cách thể hiện tự nhiên, linh hoạt
            trong các nội dung đời thường.
          </p>
        </div>
      </div>
    </main>
  );
}

export default InterestsPage;
