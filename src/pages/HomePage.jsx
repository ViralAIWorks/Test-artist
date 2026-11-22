import React from "react";
import { Link } from "react-router-dom";
import { Credit } from "../components/SiteLayout.jsx";
import content from "../data/content.json";

function HomePage() {
  const { home, stats } = content;
  return (
    <main>
      <div className="wrap hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow">{home.eyebrow}</div>
          <h1>
            {home.title}
            <br />
            <em>{home.subtitle}</em>
          </h1>
          <p>{home.description}</p>
          <div className="actions">
            <Link className="button" to="/music.html">
              Khám phá âm nhạc&nbsp; ↗
            </Link>
            <Link className="button alt" to="/profile.html">
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
        <div className="portrait">
          <img
            src={home.image}
            alt={home.imageAlt}
            fetchPriority="high"
          />
          <span className="portrait-mark">{home.imageBadge}</span>
          <span className="portrait-label">{home.imageCaption}</span>
          <span className="hero-credit">
            Ảnh:{" "}
            <a
              href={home.imageCreditUrl}
              target="_blank"
              rel="noreferrer"
            >
              {home.imageCredit}
            </a>{" "}· {home.imageLicense}
          </span>
        </div>
      </div>

      <div className="wrap">
        <div className="stats" aria-label="Thông tin nhanh">
          {stats.map((stat) => (
            <div className="stat" key={`${stat.value}-${stat.label}`}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="wrap" id="profile">
        <div className="section-head">
          <div>
            <div className="eyebrow">01 / Chân dung</div>
            <h2>
              Vũ trụ của
              <br />
              Yu Ji-min
            </h2>
          </div>
          <p>
            Một nghệ sĩ đa năng, luôn biến
            <br />
            mỗi sân khấu thành dấu ấn riêng.
          </p>
        </div>
        <div className="intro-grid">
          <article className="intro-panel">
            <h3>Từ trainee đến đội trưởng aespa</h3>
            <p>
              Karina được giới thiệu là thành viên thứ hai của aespa vào năm 2020 và ra mắt
              cùng nhóm với đĩa đơn “Black Mamba” ngày 17/11/2020. Trước đó, cô xuất hiện
              trong MV “Want” của Taemin. Năm 2022, cô cũng gia nhập nhóm nhạc dự án GOT the
              beat.
            </p>
          </article>
          <article className="intro-panel">
            <h3>Thông tin cá nhân</h3>
            <div className="facts">
              <div className="fact">
                <span>Tên thật</span>
                <strong>Yu Ji-min (유지민)</strong>
              </div>
              <div className="fact">
                <span>Nghệ danh</span>
                <strong>Karina (카리나)</strong>
              </div>
              <div className="fact">
                <span>Sinh nhật</span>
                <strong>11 tháng 4, 2000</strong>
              </div>
              <div className="fact">
                <span>Quê quán</span>
                <strong>Suwon, Hàn Quốc</strong>
              </div>
              <div className="fact">
                <span>Nhóm</span>
                <strong>aespa · GOT the beat</strong>
              </div>
              <div className="fact">
                <span>Công ty</span>
                <strong>SM Entertainment</strong>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="wrap" id="music">
        <div className="section-head">
          <div>
            <div className="eyebrow">02 / Âm nhạc</div>
            <h2>
              Những sắc thái
              <br />
              trên sân khấu
            </h2>
          </div>
          <p>
            Hip-hop là chất liệu chủ đạo;
            <br />
            R&amp;B và jazz là những màu sắc cô yêu thích.
          </p>
        </div>
        <div className="feature">
          <div className="feature-photo">
            <img
              src="https://i.pinimg.com/1200x/42/25/fe/4225fe66afac79b08fc6c0b977db6d2b.jpg"
              alt="Karina tại họp báo chương trình Agents of Mystery năm 2024"
              loading="lazy"
            />
          </div>
          <div className="feature-copy">
            <span className="tag">Solo · SYNK: PARALLEL LINE</span>
            <h3>
              “Up” — tự tin
              <br />
              theo cách của Karina
            </h3>
            <p>
              Ca khúc solo được giới thiệu trong tour của aespa, sau đó phát hành trong single
              album <em>Synk: Parallel Line</em>. Karina tham gia phát triển phần lời và dàn
              dựng sân khấu, tạo nên một màn trình diễn đậm chất hip-hop của riêng mình.
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
        <div className="cards music-cards">
          <article className="card">
            <span className="year">AESPA · 2020</span>
            <h3>Black Mamba</h3>
            <p>Ca khúc debut mở ra vũ trụ và câu chuyện độc đáo của aespa.</p>
          </article>
          <article className="card">
            <span className="year">AESPA · 2024</span>
            <h3>Supernova</h3>
            <p>
              Ca khúc chủ đề trong chuỗi phát hành <em>Armageddon</em>, tạo nên một năm bùng
              nổ của nhóm.
            </p>
          </article>
          <article className="card">
            <span className="year">SOLO · 2024</span>
            <h3>Up</h3>
            <p>Màn solo giàu năng lượng, đưa cá tính biểu diễn của Karina ra phía trước.</p>
          </article>
        </div>
      </section>

      <section className="wrap" id="achievements">
        <div className="section-head">
          <div>
            <div className="eyebrow">03 / Thành tựu</div>
            <h2>
              Dấu ấn qua từng
              <br />
              chặng đường
            </h2>
          </div>
          <p>
            Ghi rõ dấu ấn solo của Karina
            <br />
            và thành tích chung của aespa.
          </p>
        </div>
        <div className="timeline">
          <article className="timeline-item">
            <time>2020</time>
            <h3>Ra mắt cùng aespa</h3>
            <p>Debut với vai trò trưởng nhóm qua single “Black Mamba”.</p>
          </article>
          <article className="timeline-item">
            <time>2022</time>
            <h3>GOT the beat</h3>
            <p>Trở thành thành viên nhóm nhạc dự án gồm các nghệ sĩ nữ của SM.</p>
          </article>
          <article className="timeline-item">
            <time>2024</time>
            <h3>Solo “Up” bứt phá</h3>
            <p>
              Vào top 10 Circle Digital Chart và mang về chiến thắng solo đầu tiên trên Show!
              Music Core.
            </p>
          </article>
          <article className="timeline-item">
            <time>2024</time>
            <h3>Thử sức lĩnh vực giải trí</h3>
            <p>
              Tham gia chương trình <em>Synchro U</em> và nhận giải Tân binh ở hạng mục Show
              &amp; Variety tại KBS Entertainment Awards.
            </p>
          </article>
          <article className="timeline-item">
            <time>2024</time>
            <h3>aespa tại Melon Music Awards</h3>
            <p>
              aespa giành giải Artist of the Year; thành tựu nhóm, với Karina là thành viên.
            </p>
          </article>
          <article className="timeline-item">
            <time>2024</time>
            <h3>“Armageddon” era</h3>
            <p>
              Album phòng thu đầu tay của aespa, tiếp nối thế giới quan và âm thanh đặc trưng
              của nhóm.
            </p>
          </article>
        </div>
      </section>

      <section className="wrap" id="interests">
        <div className="section-head">
          <div>
            <div className="eyebrow">04 / Ngoài sân khấu</div>
            <h2>
              Gu riêng &amp; những
              <br />
              điều truyền cảm hứng
            </h2>
          </div>
          <p>
            Những mảng màu khác trong
            <br />
            câu chuyện nghệ thuật của Karina.
          </p>
        </div>
        <div className="interests">
          <article className="interest">
            <div className="icon" aria-hidden="true">♫</div>
            <h3>R&amp;B &amp; Jazz</h3>
            <p>
              Karina từng chia sẻ cô yêu thích R&amp;B và jazz, đồng thời xem hip-hop là thể
              loại chính của mình.
            </p>
          </article>
          <article className="interest">
            <div className="icon" aria-hidden="true">✦</div>
            <h3>Những nguồn cảm hứng</h3>
            <p>
              Cô nhắc đến Girls’ Generation và Camila Cabello như những hình mẫu âm nhạc có
              ảnh hưởng.
            </p>
          </article>
          <article className="interest">
            <div className="icon" aria-hidden="true">◎</div>
            <h3>Thử sức nhiều vai trò</h3>
            <p>
              Từ dẫn chương trình, show giải trí đến diễn xuất trong <em>Agents of Mystery</em>,
              Karina mở rộng hành trình ngoài âm nhạc.
            </p>
          </article>
        </div>
      </section>

      <section className="wrap" id="gallery">
        <div className="section-head">
          <div>
            <div className="eyebrow">05 / Thư viện ảnh</div>
            <h2>
              Khoảnh khắc
              <br />
              được lưu lại
            </h2>
          </div>
          <p>
            Ảnh được ghi nguồn từ
            <br />
            Wikimedia Commons.
          </p>
        </div>
        <div className="gallery">
          <figure>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/12/230601_Karina_%28aespa%29.jpg"
              alt="Karina trên đường đến ghi hình Knowing Bros, tháng 6 năm 2023"
              loading="lazy"
            />
            <figcaption>
              Hậu trường cùng aespa{" "}
              <span className="credit">
                <a
                  href="https://commons.wikimedia.org/wiki/File:230601_Karina_(aespa).jpg"
                  target="_blank"
                  rel="noreferrer"
                >
                  K-POPIT / Wikimedia Commons
                </a>{" "}
                · CC BY 3.0
              </span>
            </figcaption>
          </figure>
          <figure>
            <img
              src="https://i.pinimg.com/736x/de/e9/c5/dee9c5b7e58554848c59ca1b36a25092.jpg"
              alt="Karina tại sự kiện ra mắt chương trình Agents of Mystery, tháng 6 năm 2024"
              loading="lazy"
            />
            <figcaption>
              Một khung hình tại họp báo{" "}
              <span className="credit">
                <a
                  href="https://commons.wikimedia.org/wiki/File:Aespa_Karina_%EC%B9%B4%EB%A6%AC%EB%82%98_20240618_04_(cropped).png"
                  target="_blank"
                  rel="noreferrer"
                >
                  K-POPIT / Wikimedia Commons
                </a>{" "}
                · CC BY 3.0
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      <div className="wrap quote">
        <blockquote>“Sân khấu là nơi Karina kết nối những mảnh ghép mạnh mẽ nhất của mình.”</blockquote>
        <cite>Âm nhạc · Chuyển động · Cá tính</cite>
      </div>

      <section className="wrap" id="links">
        <div className="contact">
          <div>
            <div className="eyebrow">Theo dõi nghệ sĩ</div>
            <h2>Tiếp tục khám phá aespa.</h2>
          </div>
          <a
            className="button"
            href="https://www.smtown.com/artists/10767"
            target="_blank"
            rel="noreferrer"
          >
            SM Entertainment&nbsp; ↗
          </a>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
