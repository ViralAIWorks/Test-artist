import React from "react";
import { Link } from "react-router-dom";

const pages = [
  { path: "/profile.html", label: "Hồ sơ" },
  { path: "/music.html", label: "Âm nhạc" },
  { path: "/achievements.html", label: "Dấu ấn" },
  { path: "/interests.html", label: "Ngoài sân khấu" },
  { path: "/gallery.html", label: "Thư viện" },
];

export function SiteHeader() {
  return (
    <header className="wrap">
      <Link className="brand" to="/index.html" aria-label="Karina, về trang chủ">
        KARINA<span>.</span>
      </Link>
      <nav aria-label="Điều hướng chính">
        {pages.slice(0, 4).map((page) => (
          <Link key={page.path} to={page.path}>
            {page.label}
          </Link>
        ))}
        <Link className="nav-cta" to="/gallery.html">
          Thư viện
        </Link>
      </nav>
    </header>
  );
}

export function SubpageNav({ activePage }) {
  return (
    <nav className="subpage-links" aria-label="Khám phá các trang">
      {pages.map((page) => (
        <Link
          key={page.path}
          to={page.path}
          aria-current={page.path === activePage ? "page" : undefined}
        >
          {page.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteFooter({ home = false }) {
  return (
    <footer className="wrap">
      <span>© 2026 · Fan profile / Hồ sơ giới thiệu</span>
      <div className="social">
        <a href="https://www.instagram.com/aespa_official/" target="_blank" rel="noreferrer">
          Instagram aespa
        </a>
        <a href="https://www.youtube.com/@aespa" target="_blank" rel="noreferrer">
          YouTube aespa
        </a>
        <Link to={home ? "#home" : "/index.html#home"}>
          {home ? "Về đầu trang ↑" : "Trang chủ ↑"}
        </Link>
      </div>
    </footer>
  );
}

export function SubpageHero({ eyebrow, title, description }) {
  return (
    <div className="subpage-hero">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export function Credit({ children, className = "" }) {
  return <p className={`credit ${className}`.trim()}>{children}</p>;
}

export function ContentSections({ sections = [] }) {
  if (!sections.length) return null;
  return (
    <div className="editable-content-sections">
      {sections.map((section, index) => (
        <article
          className={`editable-content-section${section.image ? " has-image" : ""}`}
          key={`${section.title}-${index}`}
        >
          {section.image && (
            <img src={section.image} alt={section.imageAlt ?? ""} loading="lazy" />
          )}
          <div>
            {section.title && <h2>{section.title}</h2>}
            {section.text && <p>{section.text}</p>}
          </div>
        </article>
      ))}
    </div>
  );
}
