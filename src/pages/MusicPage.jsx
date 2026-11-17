import React from "react";
import { Link } from "react-router-dom";
import { Credit, SubpageHero, SubpageNav } from "../components/SiteLayout.jsx";

function MusicPage() {
  return (
    <main className="wrap subpage">
      <SubpageHero
        eyebrow="02 / Âm nhạc"
        title={
          <>
            Những sắc thái
            <br />
            <em>trên sân khấu</em>
          </>
        }
        description="Âm nhạc của aespa thay đổi giữa những lớp synth điện tử và hook giàu năng lượng. Trên sân khấu solo, Karina đưa chất hip-hop cùng phần dàn dựng do chính cô góp sức thành tâm điểm."
      />
      <SubpageNav activePage="/music.html" />
      <div className="subpage-content">
        <div className="feature">
          <div className="feature-photo">
            <img
              src="https://i.redd.it/h15mlv7sw6ie1.jpeg"
              alt="Karina cùng aespa tại Melon Music Awards 2024"
              loading="lazy"
            />
          </div>
          <div className="feature-copy">
            <span className="tag">Solo · SYNK: PARALLEL LINE</span>
            <h3>
              “Up” — sân khấu
              <br />
              mang dấu ấn cá nhân
            </h3>
            <p>
              Được giới thiệu trong tour <em>SYNK: PARALLEL LINE</em>, “Up” cho Karina không
              gian để định hình một màn solo của riêng mình. Cô góp phần viết lời, xây dựng
              vũ đạo và lựa chọn cách dàn dựng hình ảnh cho sân khấu.
            </p>
            <a
              className="text-link"
              href="https://www.youtube.com/results?search_query=aespa+Karina+Up+official"
              target="_blank"
              rel="noreferrer"
            >
              Nghe và xem trình diễn&nbsp; ↗
            </a>
            <Credit className="credit-spaced">
              Ảnh: 10Asia / Wikimedia Commons ·{" "}
              <a
                href="https://commons.wikimedia.org/wiki/File:Aespa_Karina_2024_MMA_2.jpg"
                target="_blank"
                rel="noreferrer"
              >
                CC BY 3.0
              </a>
            </Credit>
          </div>
        </div>
        <div className="section-head">
          <div>
            <div className="eyebrow">Các cột mốc</div>
            <h2>Từ debut đến solo</h2>
          </div>
          <p>
            Ba lát cắt âm thanh
            <br />
            qua các thời kỳ.
          </p>
        </div>
        <div className="cards">
          <article className="card">
            <span className="year">CHƯƠNG MỞ ĐẦU</span>
            <h3>Black Mamba</h3>
            <p>Ra mắt aespa với âm thanh điện tử mạnh và câu chuyện kết nối thế giới thực — ảo.</p>
          </article>
          <article className="card">
            <span className="year">KHOẢNH KHẮC BÙNG NỔ</span>
            <h3>Supernova</h3>
            <p>
              Nhịp điệu dồn dập và phần điệp khúc bắt tai làm nên màu sắc riêng cho era{" "}
              <em>Armageddon</em>.
            </p>
          </article>
          <article className="card">
            <span className="year">SÂN KHẤU SOLO</span>
            <h3>Up</h3>
            <p>Hip-hop, vũ đạo sắc nét và phong thái tự tin đặt Karina ở trung tâm sân khấu.</p>
          </article>
        </div>
        <div className="actions">
          <Link className="button" to="/achievements.html">
            Xem dấu ấn sự nghiệp&nbsp; ↗
          </Link>
        </div>
      </div>
    </main>
  );
}

export default MusicPage;
