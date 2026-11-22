import React from "react";
import { ContentSections, Credit, SubpageHero, SubpageNav } from "../components/SiteLayout.jsx";
import content from "../data/content.json";

function ProfilePage() {
  const page = content.pages.profile;
  return (
    <main className="wrap subpage">
      <SubpageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />
      <SubpageNav activePage="/profile.html" />
      <div className="subpage-content">
        <div className="intro-grid">
          <article className="intro-panel">
            <h3>Những bước đầu trước debut</h3>
            <p>
              Năm 2019, Karina xuất hiện trong MV “Want” của Taemin khi còn là trainee. Một
              năm sau, cô được giới thiệu là thành viên aespa và ra mắt ở vị trí trưởng nhóm.
              Cột mốc này mở ra hành trình kết hợp rap, vocal và vũ đạo trên sân khấu.
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
                <span>Sinh nhật</span>
                <strong>11 tháng 4, 2000</strong>
              </div>
              <div className="fact">
                <span>Quê quán</span>
                <strong>Suwon, Hàn Quốc</strong>
              </div>
              <div className="fact">
                <span>Hoạt động</span>
                <strong>2020 — nay</strong>
              </div>
            </div>
          </article>
        </div>
        <div className="section-head">
          <div>
            <div className="eyebrow">Một chương mới bắt đầu</div>
            <h2>aespa debut</h2>
          </div>
          <p>
            17.11.2020
            <br />
            Karina ra mắt với vai trò trưởng nhóm
          </p>
        </div>
        <img
          className="subpage-photo"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDXWW4Cyz0ONeKDj0gBQg04lTOFrEHaDTZh2eJ6mzGpzI1ahkTizV9ZTQ&s=10"
          alt="Karina cùng aespa tại Melon Music Awards 2024"
          loading="lazy"
        />
        <p className="subpage-note">
          Khung hình tại Melon Music Awards 2024 · Ảnh: 10Asia / Wikimedia Commons ·{" "}
          <a
            href="https://commons.wikimedia.org/wiki/File:Aespa_Karina_2024_MMA_2.jpg"
            target="_blank"
            rel="noreferrer"
          >
            CC BY 3.0
          </a>
        </p>
        <ContentSections sections={page.sections} />
      </div>
    </main>
  );
}

export default ProfilePage;
