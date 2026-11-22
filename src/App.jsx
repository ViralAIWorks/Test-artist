import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SiteFooter, SiteHeader } from "./components/SiteLayout.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AchievementsPage from "./pages/AchievementsPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import InterestsPage from "./pages/InterestsPage.jsx";
import MusicPage from "./pages/MusicPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import content from "./data/content.json";

const pageMetadata = {
  "/": {
    title: "Karina — Hồ sơ nghệ sĩ | aespa",
    description:
      "Hồ sơ Karina (Yu Ji-min) — trưởng nhóm aespa, nghệ sĩ solo và gương mặt đa tài của K-pop.",
  },
  "/index.html": {
    title: "Karina — Hồ sơ nghệ sĩ | aespa",
    description:
      "Hồ sơ Karina (Yu Ji-min) — trưởng nhóm aespa, nghệ sĩ solo và gương mặt đa tài của K-pop.",
  },
  "/profile.html": {
    title: `${content.pages.profile.title} | Karina in focus`,
    description: content.pages.profile.description,
  },
  "/music.html": {
    title: `${content.pages.music.title} | Karina in focus`,
    description: content.pages.music.description,
  },
  "/achievements.html": {
    title: `${content.pages.achievements.title} | Karina in focus`,
    description: content.pages.achievements.description,
  },
  "/interests.html": {
    title: `${content.pages.interests.title} | Karina in focus`,
    description: content.pages.interests.description,
  },
  "/gallery.html": {
    title: `${content.pages.gallery.title} | Karina in focus`,
    description: content.pages.gallery.description,
  },
};

function App() {
  const location = useLocation();

  useEffect(() => {
    const metadata = pageMetadata[location.pathname] ?? pageMetadata["/"];
    document.title = metadata.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", metadata.description);

    if (location.hash) {
      requestAnimationFrame(() => {
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView();
      });
    } else {
      window.scrollTo(0, 0);
    }

    if (location.pathname !== "/" && location.pathname !== "/index.html") {
      return undefined;
    }

    const revealItems = document.querySelectorAll(
      ".section-head, .stats, .intro-panel, .feature, .card, .timeline-item, .interest, .gallery figure, .quote, .contact",
    );
    const staggerGroups = document.querySelectorAll(
      ".intro-grid, .cards, .timeline, .interests, .gallery",
    );
    staggerGroups.forEach((group) => group.classList.add("reveal-stagger"));
    revealItems.forEach((item) => item.classList.add("reveal"));

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );
    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [location.hash, location.pathname]);

  if (location.pathname.replace(/\/+$/, "") === "/admin") {
    return <AdminPage />;
  }

  return (
    <>
      <SiteHeader />
      <div key={location.pathname} className="page-transition">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/index.html" element={<HomePage />} />
          <Route path="/profile.html" element={<ProfilePage />} />
          <Route path="/music.html" element={<MusicPage />} />
          <Route path="/achievements.html" element={<AchievementsPage />} />
          <Route path="/interests.html" element={<InterestsPage />} />
          <Route path="/gallery.html" element={<GalleryPage />} />
          <Route
            path="*"
            element={
              <main className="wrap subpage">
                <div className="subpage-hero">
                  <h1>Không tìm thấy trang</h1>
                  <p>Trang bạn đang tìm không tồn tại.</p>
                </div>
              </main>
            }
          />
        </Routes>
      </div>
      <SiteFooter home={location.pathname === "/" || location.pathname === "/index.html"} />
    </>
  );
}

export default App;
