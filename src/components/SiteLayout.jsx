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

function BlockHeading({ block }) {
  if (!block.eyebrow && !block.title && !block.description) return null;
  return (
    <div className="section-head">
      <div>
        {block.eyebrow && <div className="eyebrow">{block.eyebrow}</div>}
        {block.title && <h2>{block.title}</h2>}
      </div>
      {block.description && <p>{block.description}</p>}
    </div>
  );
}

export function PageContentBlocks({ blocks = [] }) {
  return blocks.map((block, blockIndex) => {
    if (block.type === "feature") {
      return (
        <div className={`feature${block.image ? "" : " feature-text-only"}`} key={`feature-${blockIndex}`}>
          {block.image && (
            <div className="feature-photo">
              <img src={block.image} alt={block.imageAlt ?? ""} loading="lazy" />
            </div>
          )}
          <div className="feature-copy">
            {block.eyebrow && <span className="tag">{block.eyebrow}</span>}
            {block.title && <h3>{block.title}</h3>}
            {block.text && <p>{block.text}</p>}
            {block.linkLabel && block.linkUrl && (
              <a className="text-link" href={block.linkUrl} target="_blank" rel="noreferrer">
                {block.linkLabel}&nbsp; ↗
              </a>
            )}
            {block.credit && (
              <Credit className="credit-spaced">
                Ảnh: {block.credit}
                {block.creditUrl && <> · <a href={block.creditUrl} target="_blank" rel="noreferrer">Xem nguồn</a></>}
              </Credit>
            )}
          </div>
        </div>
      );
    }

    if (block.type === "cards") {
      return (
        <section key={`cards-${blockIndex}`}>
          <BlockHeading block={block} />
          <div className={block.variant === "interests" ? "interests" : "cards"}>
            {(block.items ?? []).map((item, index) => (
              <article
                className={block.variant === "interests" ? "interest" : "card"}
                key={`${item.title}-${index}`}
              >
                {item.icon && <div className="icon" aria-hidden="true">{item.icon}</div>}
                {item.eyebrow && <span className="year">{item.eyebrow}</span>}
                {item.title && <h3>{item.title}</h3>}
                {item.text && <p>{item.text}</p>}
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (block.type === "timeline") {
      return (
        <section key={`timeline-${blockIndex}`}>
          <BlockHeading block={block} />
          <div className="timeline">
            {(block.items ?? []).map((item, index) => (
              <article className="timeline-item" key={`${item.date}-${item.title}-${index}`}>
                {item.date && <time>{item.date}</time>}
                {item.title && <h3>{item.title}</h3>}
                {item.text && <p>{item.text}</p>}
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (block.type === "gallery") {
      return (
        <section key={`gallery-${blockIndex}`}>
          <BlockHeading block={block} />
          <div className="gallery">
            {(block.items ?? []).map((item, index) => (
              <figure key={`${item.caption}-${index}`}>
                {item.image && <img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" />}
                <figcaption>
                  {item.caption}
                  {item.credit && (
                    <>{" "}<span className="credit">
                      {item.creditUrl
                        ? <a href={item.creditUrl} target="_blank" rel="noreferrer">{item.credit}</a>
                        : item.credit}
                    </span></>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      );
    }

    if (block.type === "facts") {
      return (
        <article className="intro-panel" key={`facts-${blockIndex}`}>
          {block.title && <h3>{block.title}</h3>}
          <div className="facts">
            {(block.items ?? []).map((item, index) => (
              <div className="fact" key={`${item.label}-${index}`}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      );
    }

    if (block.type === "quote") {
      return (
        <div className="quote" key={`quote-${blockIndex}`}>
          {block.text && <blockquote>{block.text}</blockquote>}
          {block.cite && <cite>{block.cite}</cite>}
        </div>
      );
    }

    return (
      <article className="intro-panel" key={`text-${blockIndex}`}>
        {block.title && <h3>{block.title}</h3>}
        {block.text && <p>{block.text}</p>}
      </article>
    );
  });
}

export function ContentSections({ sections = [] }) {
  if (!sections.length) return null;
  return (
    <div className="editable-content-sections">
      {sections.map((section, index) => {
        const type = section.type ?? "split";
        const image = type !== "text" && section.image;
        const copy = type !== "image";
        return (
          <article
            className={`editable-content-section layout-${type}${image ? " has-image" : ""}`}
            key={`${section.title}-${index}`}
          >
            {image && (
              <img src={section.image} alt={section.imageAlt ?? ""} loading="lazy" />
            )}
            {copy && (
              <div>
                {section.title && <h2>{section.title}</h2>}
                {section.text && <p>{section.text}</p>}
              </div>
            )}
            {type === "image" && section.title && <h2>{section.title}</h2>}
          </article>
        );
      })}
    </div>
  );
}
