import React from "react";
import { ContentSections, SubpageHero, SubpageNav } from "../components/SiteLayout.jsx";
import content from "../data/content.json";

function GalleryPage() {
  const page = content.pages.gallery;
  return (
    <main className="wrap subpage">
      <SubpageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />
      <SubpageNav activePage="/gallery.html" />
      <div className="subpage-content">
        <div className="gallery">
          <figure>
            <img
              src="https://legacy.kpopping.com/34/5/241130-aespa-Karina-Winter-2024-Melon-Music-Awards-documents-3(6).jpeg"
              alt="Karina cùng aespa tại Melon Music Awards 2024"
              loading="lazy"
            />
            <figcaption>
              Melon Music Awards 2024{" "}
              <span className="credit">
                <a
                  href="https://kpopping.com/kpics/241130-aespa-Karina-Winter-2024-Melon-Music-Awards"
                  target="_blank"
                  rel="noreferrer"
                >
                  aespa Karina & Winter - 2024 MAMA
                </a>{" "}
                
              </span>
            </figcaption>
          </figure>
          <figure>
            <img
              src="https://www.nme.com/wp-content/uploads/2024/05/agents-of-mystery-netflix.jpg"
              alt="Karina tại họp báo chương trình Agents of Mystery năm 2024"
              loading="lazy"
            />
            <figcaption>
              Họp báo Agents of Mystery{" "}
              <span className="credit">
                <a
                  href="https://www.elle.vn/the-gioi-van-hoa/review-show-agents-of-mystery-mua-2-2026/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Review show “Agents of Mystery”
                </a>{" "}
                
              </span>
            </figcaption>
          </figure>
          <figure>
            <img
              src="https://i.pinimg.com/1200x/c0/64/3e/c0643e0de094c611824b2efe97c6a79c.jpg"
              alt="Karina trên đường đến ghi hình Knowing Bros, tháng 6 năm 2023"
              loading="lazy"
            />
            <figcaption>
              Trên đường đến ghi hình Knowing Bros{" "}
              <span className="credit">
                <a
                  href="https://kpopping.com/kpics/231102-aespa-Karina-Knowing-Brothers-Recording"
                  target="_blank"
                  rel="noreferrer"
                >
                  'Knowing Brothers' Recording
                </a>{" "}
                
              </span>
            </figcaption>
          </figure>
        </div>
        <ContentSections sections={page.sections} />
      </div>
    </main>
  );
}

export default GalleryPage;
