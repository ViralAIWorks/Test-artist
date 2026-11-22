import React from "react";
import { Link } from "react-router-dom";
import { ContentSections, PageContentBlocks, SubpageHero, SubpageNav } from "../components/SiteLayout.jsx";
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
        <PageContentBlocks blocks={page.blocks} />
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
