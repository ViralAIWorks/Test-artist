import React, { useCallback, useEffect, useMemo, useState } from "react";

const pageItems = [
  ["home", "Trang chủ", "Tổng quan và hình ảnh chính"],
  ["profile", "Hồ sơ", "Tiểu sử nghệ sĩ"],
  ["music", "Âm nhạc", "Nội dung trang âm nhạc"],
  ["achievements", "Dấu ấn", "Hành trình và thành tựu"],
  ["interests", "Ngoài sân khấu", "Sở thích và cảm hứng"],
  ["gallery", "Thư viện", "Giới thiệu thư viện ảnh"],
];

const sectionTypes = [
  ["text", "Văn bản"],
  ["image", "Hình ảnh"],
  ["stacked", "Ảnh + văn bản (xếp dọc)"],
  ["split", "Ảnh + văn bản (chia 2 cột)"],
];

const blockTypes = [
  ["feature", "Ảnh nổi bật + nội dung"],
  ["cards", "Danh sách thẻ"],
  ["timeline", "Dòng thời gian"],
  ["gallery", "Bộ sưu tập ảnh"],
  ["facts", "Thông tin cá nhân"],
  ["text", "Khối văn bản"],
  ["quote", "Trích dẫn"],
];

const blockItemFields = {
  cards: [
    ["eyebrow", "Nhãn nhỏ"],
    ["title", "Tiêu đề"],
    ["text", "Nội dung", true],
    ["icon", "Biểu tượng"],
  ],
  timeline: [
    ["date", "Thời gian"],
    ["title", "Tiêu đề"],
    ["text", "Nội dung", true],
  ],
  gallery: [
    ["image", "Link ảnh"],
    ["imageAlt", "Mô tả ảnh (alt)"],
    ["caption", "Chú thích"],
    ["credit", "Nguồn ảnh"],
    ["creditUrl", "Liên kết nguồn"],
  ],
  facts: [
    ["label", "Nhãn"],
    ["value", "Giá trị"],
  ],
};

function emptyBlock(type) {
  if (type === "feature") {
    return { type, eyebrow: "", title: "", text: "", image: "", imageAlt: "", credit: "", creditUrl: "", linkLabel: "", linkUrl: "" };
  }
  if (type === "cards") {
    return { type, eyebrow: "", title: "", description: "", variant: "cards", items: [] };
  }
  if (type === "timeline" || type === "gallery" || type === "facts") {
    return { type, eyebrow: "", title: "", description: "", items: [] };
  }
  if (type === "quote") return { type, text: "", cite: "" };
  return { type: "text", eyebrow: "", title: "", text: "" };
}

function emptyBlockItem(type) {
  if (type === "timeline") return { date: "", title: "", text: "" };
  if (type === "gallery") return { image: "", imageAlt: "", caption: "", credit: "", creditUrl: "" };
  if (type === "facts") return { label: "", value: "" };
  return { eyebrow: "", title: "", text: "", icon: "" };
}

const homeFields = [
  ["eyebrow", "Dòng giới thiệu nhỏ"],
  ["title", "Tên nghệ sĩ"],
  ["subtitle", "Tiêu đề phụ"],
  ["description", "Mô tả trang chủ", "textarea"],
  ["image", "Đường dẫn ảnh"],
  ["imageAlt", "Mô tả ảnh (alt)"],
  ["imageBadge", "Nhãn trên ảnh"],
  ["imageCaption", "Chú thích ảnh"],
  ["imageCredit", "Nguồn ảnh"],
  ["imageCreditUrl", "Liên kết nguồn ảnh"],
  ["imageLicense", "Giấy phép ảnh"],
];

function Field({ label, value, onChange, multiline = false, hint }) {
  const Control = multiline ? "textarea" : "input";
  return (
    <label className="admin-field">
      <span>{label}</span>
      <Control
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        rows={multiline ? 4 : undefined}
        type={multiline ? undefined : "text"}
      />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function AdminPage() {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState(null);
  const [sha, setSha] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [newBlockType, setNewBlockType] = useState("feature");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadContent = useCallback(async () => {
    setError("");
    const response = await fetch("/api/content");
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error ?? "Không tải được nội dung.");
    }
    setContent(result.content);
    setSha(result.sha);
  }, []);

  useEffect(() => {
    let active = true;
    async function initialize() {
      try {
        const sessionResponse = await fetch("/api/auth/session");
        const session = await sessionResponse.json();
        if (!active) return;
        if (session.authenticated) {
          setUser(session.user);
          await loadContent();
        }
      } catch (loadError) {
        if (active) setError(loadError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    initialize();
    return () => {
      active = false;
    };
  }, [loadContent]);

  const updateContent = (update) => {
    setContent((current) => ({ ...current, ...update }));
    setMessage("");
  };

  const pageContent = content
    ? activePage === "home" ? content.home : content.pages[activePage]
    : {};
  const sections = pageContent.sections ?? [];
  const blocks = pageContent.blocks ?? [];

  function updateSections(pageId, update) {
    setContent((current) => {
      const currentPage = pageId === "home" ? current.home : current.pages[pageId];
      const updatedPage = { ...currentPage, sections: update(currentPage.sections ?? []) };
      return pageId === "home"
        ? { ...current, home: updatedPage }
        : { ...current, pages: { ...current.pages, [pageId]: updatedPage } };
    });
    setMessage("");
  }

  function updateBlocks(pageId, update) {
    setContent((current) => ({
      ...current,
      pages: {
        ...current.pages,
        [pageId]: { ...current.pages[pageId], blocks: update(current.pages[pageId].blocks ?? []) },
      },
    }));
    setMessage("");
  }

  async function uploadImage(file, pageId, sectionIndex, blockIndex = null, itemIndex = null) {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type) || file.size > 3 * 1024 * 1024) {
      setError("Chọn ảnh JPEG, PNG, WebP hoặc GIF có dung lượng dưới 3 MB.");
      return;
    }

    setError("");
    setMessage("");
    const uploadKey = blockIndex === null
      ? `${pageId}-${sectionIndex}`
      : `${pageId}-block-${blockIndex}-${itemIndex ?? "main"}`;
    setUploadingImage(uploadKey);
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") resolve(reader.result);
          else reject(new Error("Không thể đọc tệp ảnh."));
        };
        reader.onerror = () => reject(new Error("Không thể đọc tệp ảnh."));
        reader.readAsDataURL(file);
      });
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: { type: file.type, data: dataUrl.split(",")[1] } }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Không thể tải ảnh lên.");
      if (blockIndex === null) {
        updateSections(pageId, (currentSections) =>
          currentSections.map((section, index) =>
            index === sectionIndex ? { ...section, image: result.url } : section,
          ),
        );
      } else {
        updateBlocks(pageId, (currentBlocks) =>
          currentBlocks.map((block, index) => {
            if (index !== blockIndex) return block;
            if (itemIndex === null) return { ...block, image: result.url };
            return {
              ...block,
              items: block.items.map((item, currentIndex) =>
                currentIndex === itemIndex ? { ...item, image: result.url } : item,
              ),
            };
          }),
        );
      }
      setMessage("Ảnh đã được lưu vào GitHub. Hãy lưu nội dung để xuất bản.");
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setUploadingImage(null);
    }
  }

  const selectedLabel = useMemo(
    () => pageItems.find(([id]) => id === activePage)?.[1] ?? "Trang chủ",
    [activePage],
  );

  async function saveContent(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sha }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Không thể lưu nội dung.");
      setSha(result.sha);
      setMessage("Đã lưu vào GitHub. Vercel sẽ tự triển khai bản cập nhật.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    setError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Không thể đăng xuất.");
      setUser(null);
      setContent(null);
      setSha(null);
    } catch (logoutError) {
      setError(logoutError.message);
    }
  }

  if (loading) {
    return <main className="admin-loading">Đang kết nối dashboard…</main>;
  }

  if (!user) {
    const authError = new URLSearchParams(window.location.search).get("error");
    return (
      <main className="admin-login">
        <div className="admin-login-card">
          <a className="admin-wordmark" href="/">DASHBOARD<span>.</span></a>
          <div className="admin-kicker">KHU VỰC QUẢN TRỊ</div>
          <h1>Chỉnh sửa nội dung<br /><em>theo cách của bạn.</em></h1>
          <p>Đăng nhập bằng GitHub để quản lý nội dung website. Mỗi lần xuất bản sẽ tạo một commit và Vercel tự cập nhật website.</p>
          {authError === "not_authorized" && (
            <div className="admin-alert" role="alert">Tài khoản GitHub này chưa được cấp quyền quản trị.</div>
          )}
          {authError === "github_login" && (
            <div className="admin-alert" role="alert">Đăng nhập GitHub chưa hoàn tất. Vui lòng thử lại.</div>
          )}
          {error && <div className="admin-alert" role="alert">{error}</div>}
          <a className="admin-github-button" href="/api/auth/start">
            <GitHubIcon />
            Đăng nhập với GitHub
          </a>
          <a className="admin-back-link" href="/">← Quay lại website</a>
          <div className="admin-login-note"><span className="admin-lock">◇</span> Chỉ tài khoản được chỉ định mới có thể chỉnh sửa.</div>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="admin-loading admin-error-state">
        <p>{error || "Không thể tải nội dung."}</p>
        <button className="admin-primary-button" onClick={() => loadContent().catch((e) => setError(e.message))}>
          Thử tải lại
        </button>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-wordmark" href="/">DASHBOARD<span>.</span></a>
        <div className="admin-workspace">
          <div className="admin-avatar">K</div>
          <div><strong>Karina in focus</strong><small>Quản lý nội dung</small></div>
          <span className="admin-workspace-chevron">⌄</span>
        </div>
        <div className="admin-nav-label">NỘI DUNG WEBSITE</div>
        <nav className="admin-nav" aria-label="Các trang nội dung">
          {pageItems.map(([id, label, detail], index) => (
            <button
              key={id}
              className={activePage === id ? "is-active" : ""}
              onClick={() => { setActivePage(id); setMessage(""); }}
            >
              <span className="admin-nav-icon">{index === 0 ? "⌂" : String(index).padStart(2, "0")}</span>
              <span>{label}<small>{detail}</small></span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer">↗ Xem website</a>
          <button onClick={logout}>↪ Đăng xuất</button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">Dashboard <span>/</span> {selectedLabel}</div>
          <div className="admin-user"><span className="admin-status-dot" /> {user}</div>
        </header>

        <div className="admin-workspace-content">
          <div className="admin-heading-row">
            <div>
              <div className="admin-kicker">KHÔNG GIAN NỘI DUNG</div>
              <h1>Dashboard · {selectedLabel}</h1>
              <p>Chỉnh sửa nội dung và thông tin hiển thị trên website.</p>
            </div>
            <button className="admin-primary-button" onClick={saveContent} disabled={saving || uploadingImage !== null}>
              <span>{saving ? "◌" : "↑"}</span>
              {saving ? "Đang xuất bản…" : "Lưu và xuất bản"}
            </button>
          </div>

          {(error || message) && (
            <div className={`admin-toast ${error ? "is-error" : "is-success"}`} role="status">
              <span>{error ? "!" : "✓"}</span>{error || message}
            </div>
          )}

          <div className="admin-editor-layout">
            <form className="admin-editor-card" onSubmit={saveContent}>
              <div className="admin-card-heading">
                <div><h2>{activePage === "home" ? "Nội dung nổi bật" : "Tiêu đề trang"}</h2><p>Các thay đổi sẽ xuất bản lên website sau khi lưu.</p></div>
                <span className="admin-card-icon">✦</span>
              </div>
              {activePage === "home" ? (
                <>
                  <div className="admin-field-grid">
                    {homeFields.map(([key, label, type]) => (
                      <Field
                        key={key}
                        label={label}
                        value={content.home[key]}
                        multiline={type === "textarea"}
                        onChange={(value) => updateContent({ home: { ...content.home, [key]: value } })}
                        hint={key === "image" || key === "imageCreditUrl" ? "Nên dùng URL ảnh và nguồn có thể truy cập công khai." : undefined}
                      />
                    ))}
                  </div>
                  <div className="admin-divider" />
                  <div className="admin-card-heading admin-stats-heading">
                    <div><h2>Thông tin nhanh</h2><p>Các con số hiển thị bên dưới ảnh bìa.</p></div>
                    <button
                      type="button"
                      className="admin-add-button"
                      onClick={() => updateContent({ stats: [...content.stats, { value: "", label: "" }] })}
                    >＋ Thêm mục</button>
                  </div>
                  <div className="admin-stats-list">
                    {content.stats.map((stat, index) => (
                      <div className="admin-stat-row" key={`stat-${index}`}>
                        <Field
                          label="Giá trị"
                          value={stat.value}
                          onChange={(value) => updateContent({
                            stats: content.stats.map((item, itemIndex) => itemIndex === index ? { ...item, value } : item),
                          })}
                        />
                        <Field
                          label="Nhãn"
                          value={stat.label}
                          onChange={(label) => updateContent({
                            stats: content.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label } : item),
                          })}
                        />
                        <button
                          type="button"
                          className="admin-remove-button"
                          aria-label={`Xóa mục ${index + 1}`}
                          onClick={() => updateContent({ stats: content.stats.filter((_, itemIndex) => itemIndex !== index) })}
                        >×</button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="admin-field-grid">
                  {[
                    ["eyebrow", "Dòng giới thiệu nhỏ"],
                    ["title", "Tiêu đề trang"],
                    ["description", "Mô tả trang", "textarea"],
                  ].map(([key, label, type]) => (
                    <Field
                      key={key}
                      label={label}
                      value={content.pages[activePage][key]}
                      multiline={type === "textarea"}
                      onChange={(value) => updateContent({
                        pages: {
                          ...content.pages,
                          [activePage]: { ...content.pages[activePage], [key]: value },
                        },
                      })}
                    />
                  ))}
                </div>
              )}
              {activePage !== "home" && (
                <>
                  <div className="admin-divider" />
                  <div className="admin-card-heading admin-stats-heading">
                    <div><h2>Nội dung trên trang</h2><p>Chỉnh sửa ảnh, thẻ, mốc thời gian và các khối nội dung đang hiển thị.</p></div>
                    <div className="admin-block-add">
                      <select
                        aria-label="Loại nội dung mới"
                        value={newBlockType}
                        onChange={(event) => setNewBlockType(event.target.value)}
                      >
                        {blockTypes.map(([type, label]) => <option key={type} value={type}>{label}</option>)}
                      </select>
                      <button
                        type="button"
                        className="admin-add-button"
                        onClick={() => updateBlocks(activePage, (currentBlocks) => [...currentBlocks, emptyBlock(newBlockType)])}
                      >＋ Thêm khối</button>
                    </div>
                  </div>
                  <div className="admin-content-sections">
                    {blocks.map((block, blockIndex) => {
                      const updateBlock = (update) => updateBlocks(activePage, (currentBlocks) =>
                        currentBlocks.map((item, index) => index === blockIndex ? update(item) : item),
                      );
                      const itemFields = blockItemFields[block.type] ?? [];
                      const headingFields = block.type === "feature"
                        ? [
                          ["eyebrow", "Nhãn nhỏ"], ["title", "Tiêu đề"], ["text", "Nội dung", true],
                          ["image", "Link ảnh"], ["imageAlt", "Mô tả ảnh (alt)"], ["credit", "Nguồn ảnh"],
                          ["creditUrl", "Liên kết nguồn ảnh"], ["linkLabel", "Nhãn liên kết"], ["linkUrl", "Đường dẫn liên kết"],
                        ]
                        : block.type === "cards" || block.type === "timeline" || block.type === "gallery"
                          ? [["eyebrow", "Dòng giới thiệu nhỏ"], ["title", "Tiêu đề khối"], ["description", "Mô tả", true]]
                          : block.type === "facts"
                            ? [["title", "Tiêu đề khối"]]
                            : block.type === "quote"
                              ? [["text", "Trích dẫn", true], ["cite", "Dòng ghi chú"]]
                              : [["eyebrow", "Dòng giới thiệu nhỏ"], ["title", "Tiêu đề"], ["text", "Nội dung", true]];
                      return (
                        <div className="admin-content-section" key={`${activePage}-block-${blockIndex}`}>
                          <div className="admin-content-section-heading">
                            <strong>{blockTypes.find(([type]) => type === block.type)?.[1] ?? "Khối nội dung"} {blockIndex + 1}</strong>
                            <button
                              type="button"
                              className="admin-remove-button"
                              aria-label={`Xóa khối nội dung ${blockIndex + 1}`}
                              disabled={uploadingImage !== null || saving}
                              onClick={() => updateBlocks(activePage, (currentBlocks) =>
                                currentBlocks.filter((_, index) => index !== blockIndex),
                              )}
                            >×</button>
                          </div>
                          <div className="admin-field-grid">
                            {headingFields.map(([key, label, multiline]) => (
                              <Field
                                key={key}
                                label={label}
                                value={block[key]}
                                multiline={multiline}
                                onChange={(value) => updateBlock((currentBlock) => ({ ...currentBlock, [key]: value }))}
                              />
                            ))}
                            {block.type === "cards" && (
                              <label className="admin-field">
                                <span>Kiểu trình bày</span>
                                <select
                                  value={block.variant ?? "cards"}
                                  onChange={(event) => updateBlock((currentBlock) => ({ ...currentBlock, variant: event.target.value }))}
                                >
                                  <option value="cards">Thẻ nội dung</option>
                                  <option value="interests">Thẻ sở thích</option>
                                </select>
                              </label>
                            )}
                          </div>
                          {block.type === "feature" && (
                            <label className="admin-upload-control">
                              <span>{uploadingImage === `${activePage}-block-${blockIndex}-main` ? "Đang tải ảnh lên…" : "Tải ảnh từ thiết bị"}</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                disabled={uploadingImage !== null}
                                onChange={(event) => {
                                  uploadImage(event.target.files?.[0], activePage, null, blockIndex);
                                  event.target.value = "";
                                }}
                              />
                              <small>JPEG, PNG, WebP hoặc GIF · tối đa 3 MB.</small>
                            </label>
                          )}
                          {itemFields.length > 0 && (
                            <>
                              <div className="admin-block-items-heading">
                                <strong>{block.type === "gallery" ? "Ảnh trong thư viện" : "Các mục"}</strong>
                                <button
                                  type="button"
                                  className="admin-add-button"
                                  disabled={(block.items ?? []).length >= 30}
                                  onClick={() => updateBlock((currentBlock) => ({
                                    ...currentBlock,
                                    items: [...(currentBlock.items ?? []), emptyBlockItem(block.type)],
                                  }))}
                                >＋ Thêm mục</button>
                              </div>
                              <div className="admin-block-items">
                                {(block.items ?? []).map((item, itemIndex) => (
                                  <div className="admin-block-item" key={`${block.type}-${blockIndex}-item-${itemIndex}`}>
                                    <div className="admin-content-section-heading">
                                      <strong>Mục {itemIndex + 1}</strong>
                                      <button
                                        type="button"
                                        className="admin-remove-button"
                                        aria-label={`Xóa mục ${itemIndex + 1}`}
                                        disabled={uploadingImage !== null || saving}
                                        onClick={() => updateBlock((currentBlock) => ({
                                          ...currentBlock,
                                          items: currentBlock.items.filter((_, index) => index !== itemIndex),
                                        }))}
                                      >×</button>
                                    </div>
                                    <div className="admin-field-grid">
                                      {itemFields.map(([key, label, multiline]) => (
                                        <Field
                                          key={key}
                                          label={label}
                                          value={item[key]}
                                          multiline={multiline}
                                          onChange={(value) => updateBlock((currentBlock) => ({
                                            ...currentBlock,
                                            items: currentBlock.items.map((currentItem, index) =>
                                              index === itemIndex ? { ...currentItem, [key]: value } : currentItem,
                                            ),
                                          }))}
                                        />
                                      ))}
                                    </div>
                                    {block.type === "gallery" && (
                                      <label className="admin-upload-control">
                                        <span>{uploadingImage === `${activePage}-block-${blockIndex}-${itemIndex}` ? "Đang tải ảnh lên…" : "Tải ảnh từ thiết bị"}</span>
                                        <input
                                          type="file"
                                          accept="image/jpeg,image/png,image/webp,image/gif"
                                          disabled={uploadingImage !== null}
                                          onChange={(event) => {
                                            uploadImage(event.target.files?.[0], activePage, null, blockIndex, itemIndex);
                                            event.target.value = "";
                                          }}
                                        />
                                        <small>JPEG, PNG, WebP hoặc GIF · tối đa 3 MB.</small>
                                      </label>
                                    )}
                                  </div>
                                ))}
                                {(block.items ?? []).length === 0 && (
                                  <p className="admin-empty-sections">Chưa có mục nào trong khối này.</p>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                    {blocks.length === 0 && (
                      <p className="admin-empty-sections">Chưa có nội dung chính. Chọn kiểu khối rồi nhấn “Thêm khối”.</p>
                    )}
                  </div>
                </>
              )}
              <div className="admin-divider" />
              <div className="admin-card-heading admin-stats-heading">
                <div><h2>Nội dung bổ sung</h2><p>Thêm các khối nội dung và ảnh vào cuối trang này.</p></div>
                <button
                  type="button"
                  className="admin-add-button"
                  onClick={() => updateSections(activePage, (currentSections) => [
                    ...currentSections,
                    { type: "text", title: "", text: "", image: "", imageAlt: "" },
                  ])}
                >＋ Thêm mục</button>
              </div>
              <div className="admin-content-sections">
                {sections.map((section, index) => (
                  <div className="admin-content-section" key={`${activePage}-section-${index}`}>
                    <div className="admin-content-section-heading">
                      <strong>Mục {index + 1}</strong>
                      <button
                        type="button"
                        className="admin-remove-button"
                        aria-label={`Xóa mục ${index + 1}`}
                        disabled={uploadingImage !== null || saving}
                        onClick={() => updateSections(activePage, (currentSections) =>
                          currentSections.filter((_, itemIndex) => itemIndex !== index),
                        )}
                      >×</button>
                    </div>
                    <div className="admin-field-grid">
                      <label className="admin-field">
                        <span>Kiểu nội dung</span>
                        <select
                          value={section.type ?? "split"}
                          onChange={(event) => {
                            const type = event.target.value;
                            updateSections(activePage, (currentSections) =>
                              currentSections.map((item, itemIndex) => itemIndex === index ? { ...item, type } : item),
                            );
                          }}
                        >
                          {sectionTypes.map(([type, label]) => (
                            <option key={type} value={type}>{label}</option>
                          ))}
                        </select>
                      </label>
                      <Field
                        label={section.type === "image" ? "Chú thích ảnh (không bắt buộc)" : "Tiêu đề mục"}
                        value={section.title}
                        onChange={(title) => updateSections(activePage, (currentSections) =>
                          currentSections.map((item, itemIndex) => itemIndex === index ? { ...item, title } : item),
                        )}
                      />
                      {section.type !== "image" && (
                        <Field
                          label="Nội dung"
                          value={section.text}
                          multiline
                          onChange={(text) => updateSections(activePage, (currentSections) =>
                            currentSections.map((item, itemIndex) => itemIndex === index ? { ...item, text } : item),
                          )}
                        />
                      )}
                      {section.type !== "text" && (
                        <>
                          <Field
                            label="Link ảnh"
                            value={section.image}
                            onChange={(image) => updateSections(activePage, (currentSections) =>
                              currentSections.map((item, itemIndex) => itemIndex === index ? { ...item, image } : item),
                            )}
                            hint="Dán URL ảnh công khai hoặc tải ảnh lên bên dưới."
                          />
                          <Field
                            label="Mô tả ảnh (alt)"
                            value={section.imageAlt}
                            onChange={(imageAlt) => updateSections(activePage, (currentSections) =>
                              currentSections.map((item, itemIndex) => itemIndex === index ? { ...item, imageAlt } : item),
                            )}
                          />
                        </>
                      )}
                    </div>
                    {section.type !== "text" && (
                      <label className="admin-upload-control">
                        <span>{uploadingImage === `${activePage}-${index}` ? "Đang tải ảnh lên…" : "Hoặc chọn ảnh từ thiết bị"}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          disabled={uploadingImage !== null}
                          onChange={(event) => {
                            uploadImage(event.target.files?.[0], activePage, index);
                            event.target.value = "";
                          }}
                        />
                        <small>JPEG, PNG, WebP hoặc GIF · tối đa 3 MB. Ảnh được lưu vào repo GitHub.</small>
                      </label>
                    )}
                  </div>
                ))}
                {sections.length === 0 && (
                  <p className="admin-empty-sections">Chưa có mục bổ sung. Nhấn “Thêm mục” để bắt đầu.</p>
                )}
              </div>
              <div className="admin-form-footer">
                <span>✦ &nbsp;Lưu thay đổi sẽ tạo commit trên GitHub.</span>
                <button className="admin-primary-button" type="submit" disabled={saving || uploadingImage !== null}>
                  {saving ? "Đang lưu…" : "Lưu thay đổi"}
                </button>
              </div>
            </form>

            <aside className="admin-preview-card">
              <div className="admin-preview-header"><span>XEM TRƯỚC</span><span className="admin-preview-live"><i /> BẢN NHÁP</span></div>
              {activePage === "home" ? (
                <div className="admin-preview-home">
                  <div className="admin-preview-image">
                    <img src={content.home.image} alt="" />
                    <span>{content.home.imageBadge}</span>
                    <small>{content.home.imageCaption}</small>
                  </div>
                  <div className="admin-preview-copy">
                    <div>{content.home.eyebrow}</div>
                    <h2>{content.home.title}<br /><em>{content.home.subtitle}</em></h2>
                    <p>{content.home.description}</p>
                  </div>
                  <div className="admin-preview-stats">
                    {content.stats.slice(0, 3).map((stat, index) => <span key={index}><b>{stat.value}</b>{stat.label}</span>)}
                  </div>
                </div>
              ) : (
                <div className="admin-preview-page">
                  <div>{content.pages[activePage].eyebrow}</div>
                  <h2>{content.pages[activePage].title}</h2>
                  <p>{content.pages[activePage].description}</p>
                  <span className="admin-preview-rule" />
                  <small>DASHBOARD · BẢN NHÁP</small>
                </div>
              )}
              {activePage !== "home" && blocks.length > 0 && (
                <div className="admin-preview-sections">
                  {blocks.map((block, index) => (
                    <article className={`admin-preview-block-${block.type}`} key={`preview-block-${index}`}>
                      {block.type === "feature" && (
                        <>
                          {block.image && <img src={block.image} alt="" />}
                          {block.eyebrow && <small>{block.eyebrow}</small>}
                          {block.title && <h3>{block.title}</h3>}
                          {block.text && <p>{block.text}</p>}
                        </>
                      )}
                      {(block.type === "cards" || block.type === "timeline" || block.type === "facts") && (
                        <>
                          {block.title && <h3>{block.title}</h3>}
                          {(block.items ?? []).slice(0, 3).map((item, itemIndex) => (
                            <div className="admin-preview-block-item" key={`preview-item-${itemIndex}`}>
                              {item.image && <img src={item.image} alt="" />}
                              {(item.eyebrow || item.date || item.label) && (
                                <small>{item.eyebrow || item.date || item.label}</small>
                              )}
                              {item.title && <strong>{item.title}</strong>}
                              {(item.text || item.value) && <p>{item.text || item.value}</p>}
                            </div>
                          ))}
                        </>
                      )}
                      {block.type === "gallery" && (
                        <div className="admin-preview-gallery">
                          {(block.items ?? []).slice(0, 3).map((item, itemIndex) => (
                            <div key={`preview-gallery-${itemIndex}`}>
                              {item.image && <img src={item.image} alt="" />}
                              <small>{item.caption}</small>
                            </div>
                          ))}
                        </div>
                      )}
                      {block.type === "text" && (
                        <>
                          {block.title && <h3>{block.title}</h3>}
                          {block.text && <p>{block.text}</p>}
                        </>
                      )}
                      {block.type === "quote" && (
                        <>
                          {block.text && <p>“{block.text}”</p>}
                          {block.cite && <small>{block.cite}</small>}
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}
              {sections.length > 0 && (
                <div className="admin-preview-sections">
                  {sections.map((section, index) => {
                    const type = section.type ?? "split";
                    return (
                      <article className={`admin-preview-section-${type}`} key={`preview-${activePage}-${index}`}>
                        {type !== "text" && section.image && <img src={section.image} alt="" />}
                        {type === "split" || type === "stacked" ? (
                          <div>
                            {section.title && <h3>{section.title}</h3>}
                            {section.text && <p>{section.text}</p>}
                          </div>
                        ) : (
                          <>
                            {section.title && <h3>{section.title}</h3>}
                            {type !== "image" && section.text && <p>{section.text}</p>}
                          </>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
              <div className="admin-preview-footnote">Bản xem trước mô phỏng nội dung chính.</div>
            </aside>
          </div>
          <footer className="admin-footer-note">Nội dung được lưu trên GitHub · Vercel tự triển khai sau mỗi lần xuất bản.</footer>
        </div>
      </section>
    </main>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.03c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.6 1.2 3.24.92.1-.72.39-1.2.7-1.48-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.29-2.61 5.23-5.1 5.5.4.35.75 1.03.75 2.08V22c0 .29.2.63.77.52A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

export default AdminPage;
