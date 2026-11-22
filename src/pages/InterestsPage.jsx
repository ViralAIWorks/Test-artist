import React from "react";
import { ContentSections, PageContentBlocks, SubpageHero, SubpageNav } from "../components/SiteLayout.jsx";
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
        <PageContentBlocks blocks={page.blocks} />
        <ContentSections sections={page.sections} />
      </div>
    </main>
  );
}

export default InterestsPage;
