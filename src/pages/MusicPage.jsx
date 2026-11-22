import React from "react";
import { Link } from "react-router-dom";
import { ContentSections, PageContentBlocks, SubpageHero, SubpageNav } from "../components/SiteLayout.jsx";
import content from "../data/content.json";

function MusicPage() {
  const page = content.pages.music;
  return (
    <main className="wrap subpage">
      <SubpageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />
      <SubpageNav activePage="/music.html" />
      <div className="subpage-content">
        <PageContentBlocks blocks={page.blocks} />
        <div className="actions">
          <Link className="button" to="/achievements.html">
            Xem dấu ấn sự nghiệp&nbsp; ↗
          </Link>
        </div>
        <ContentSections sections={page.sections} />
      </div>
    </main>
  );
}

export default MusicPage;
