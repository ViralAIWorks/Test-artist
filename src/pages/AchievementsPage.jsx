import React from "react";
import { Link } from "react-router-dom";
import { ContentSections, Credit, SubpageHero, SubpageNav } from "../components/SiteLayout.jsx";
import content from "../data/content.json";

function AchievementsPage() {
  const page = content.pages.achievements;
  return (
    <main className="wrap subpage">
      <SubpageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />
      <SubpageNav activePage="/achievements.html" />
      <div className="subpage-content">
        <div className="feature">
          <div className="feature-photo">
            <img
              src="https://images.gmanews.tv/webpics/2024/05/agents-of-mystery_2024_05_23_13_57_23.jpg"
              alt="Karina tại họp báo Agents of Mystery năm 2024"
              loading="lazy"
            />
          </div>
          <div className="feature-copy">
            <span className="tag">Mở rộng địa hạt</span>
            <h3>Từ sân khấu đến màn ảnh</h3>
            <p>
              Với chương trình <em>Synchro U</em> và series <em>Agents of Mystery</em>, Karina
              thử sức ở những định dạng cần phản ứng nhanh, phối hợp nhóm và kể chuyện trước
              ống kính.
            </p>
            <Credit>
              Ảnh: K-POPIT / Wikimedia Commons ·{" "}
              <a
                href="https://commons.wikimedia.org/wiki/File:Aespa_Karina_%EC%B9%B4%EB%A6%AC%EB%82%98_20240618_04_(cropped).png"
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
            <div className="eyebrow">Các cột mốc nổi bật</div>
            <h2>Những bước tiến đáng nhớ</h2>
          </div>
          <p>
            Thành tích solo và giải thưởng nhóm
            <br />
            được phân biệt rõ ràng.
          </p>
        </div>
        <div className="timeline">
          <article className="timeline-item">
            <time>2020</time>
            <h3>Ra mắt với aespa</h3>
            <p>“Black Mamba” đưa Karina đến với khán giả trong vai trò đội trưởng.</p>
          </article>
          <article className="timeline-item">
            <time>2024 · SOLO</time>
            <h3>“Up” vào top 10</h3>
            <p>
              Ca khúc solo vào top 10 Circle Digital Chart; Karina giành chiến thắng solo đầu
              tiên trên Show! Music Core.
            </p>
          </article>
          <article className="timeline-item">
            <time>2024 · CÁ NHÂN</time>
            <h3>Tân binh giải trí</h3>
            <p>
              Giải Rookie Award – Show &amp; Variety tại KBS Entertainment Awards ghi nhận
              hoạt động truyền hình của cô.
            </p>
          </article>
          <article className="timeline-item">
            <time>2024 · AESPA</time>
            <h3>Artist of the Year</h3>
            <p>
              aespa nhận giải Artist of the Year tại Melon Music Awards — thành tựu chung
              của nhóm.
            </p>
          </article>
        </div>
        <div className="actions">
          <Link className="button" to="/music.html">
            Khám phá âm nhạc&nbsp; ↗
          </Link>
        </div>
        <ContentSections sections={page.sections} />
      </div>
    </main>
  );
}

export default AchievementsPage;
