import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import API from "../api/apiClient";
import { useToast } from "../components/ToastContext";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import ReportForm from "../components/ReportForm";
import ItemCard from "../components/ItemCard";
import { SkeletonGrid } from "../components/Skeleton";

export default function Home() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("found");
  const [foundItems, setFoundItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileChatView, setMobileChatView] = useState("list");

  const currentUser = API.getCurrentUser() || { email: "anonymous" };

  const topHotspots = useMemo(() => {
    const locCounts = {};
    foundItems.forEach(item => {
      if (item.location) {
        const loc = item.location.trim().toLowerCase();
        locCounts[loc] = (locCounts[loc] || 0) + 1;
      }
    });
    return Object.entries(locCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([loc]) => loc.charAt(0).toUpperCase() + loc.slice(1));
  }, [foundItems]);

  useEffect(() => {
    loadFoundItems();
  }, []);

  const loadFoundItems = async () => {
    setLoading(true);
    try {
      const data = await API.getAllFound();
      setFoundItems(data.items || []);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByImage = async (file) => {
    if (!file) { toast.warning("Please select an image"); return; }
    setLoading(true);
    try {
      const results = await API.searchLost({ file });
      setSearchResults(results.matches || []);
      if ((results.matches || []).length > 0) {
        toast.success(`Found ${results.matches.length} matching items!`);
      } else {
        toast.info("No matches found. Try a different image.");
      }
    } catch (error) {
      toast.error("Error searching: " + error.message);
    } finally { setLoading(false); }
  };

  const handleSearchByText = async (text) => {
    if (!text.trim()) { toast.warning("Please enter a search term"); return; }
    setLoading(true);
    try {
      const results = await API.searchLost({ text_query: text });
      setSearchResults(results.matches || []);
      if ((results.matches || []).length > 0) {
        toast.success(`Found ${results.matches.length} matching items!`);
      } else {
        toast.info("No matches found. Try different keywords.");
      }
    } catch (error) {
      toast.error("Error searching: " + error.message);
    } finally { setLoading(false); }
  };

  const handleReport = async (formData, reportFile, reportType) => {
    if ((reportType === "found" && !reportFile) || !formData.location || !formData.contact) {
      toast.warning("Please fill all required fields");
      return;
    }
    const form = new FormData();
    if (reportFile) {
      form.append("file", reportFile);
    }
    form.append("location", formData.location);
    form.append("contact", formData.contact);
    form.append("description", formData.description);
    form.append("category", formData.category);
    setLoading(true);
    try {
      if (reportType === "found") {
        await API.reportFound(form);
        toast.success("Found item reported successfully!");
      } else {
        await API.reportLost(form);
        toast.success("Lost item reported successfully!");
      }
      setActiveTab("my-reports");
      loadFoundItems();
    } catch (error) {
      toast.error("Error reporting item: " + error.message);
    } finally { setLoading(false); }
  };

  const handleFlagDispute = async (filename) => {
    if (!confirm("Are you sure you want to flag this claim as disputed?")) return;
    setLoading(true);
    try {
      await API.updateItemStatus(filename, "disputed");
      toast.success("Dispute flagged successfully! Administrators notified.");
      loadFoundItems();
    } catch (error) {
      toast.error("Error flagging dispute: " + error.message);
    } finally { setLoading(false); }
  };

  const myReportedItems = foundItems.filter((item) => item.reported_by === currentUser.email);

  return (
    <div className="page animate-fade-in">
      <Header />

      <main className="page-content">
        {/* Report Form Tab */}
        {activeTab === "report" && (
          <div className="max-w-2xl mx-auto mb-8">
            <ReportForm
              onSubmit={handleReport}
              loading={loading}
              onCancel={() => setActiveTab("found")}
            />
          </div>
        )}

        {/* Browse Found Items Tab */}
        {activeTab === "found" && (
          <div className="animate-slide-up">
            {/* Welcome Hero */}
            <div className="animate-slide-up mb-8" style={{ position: "relative", overflow: "hidden", borderRadius: "var(--radius-xl)", padding: "var(--space-4)" }}>
              <div className="bg-blob" style={{
                width: 200, height: 200, background: "rgba(124,58,237,0.06)", top: -50, right: -50, filter: "blur(60px)", position: "absolute"
              }}></div>
              <h2 className="gradient-text" style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(1.2rem, 3.5vw, 1.7rem)",
                fontWeight: 800,
                margin: 0,
              }}>
                Welcome back, {currentUser.name || "Explorer"} 👋
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "var(--space-2)" }}>
                {foundItems.length} items currently in campus inventory
              </p>
            </div>

            {topHotspots.length > 0 && (
              <div className="card mb-8 animate-slide-up" style={{ padding: "var(--space-4)", background: "var(--bg-surface)", borderLeft: "4px solid var(--warning)", display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--warning-subtle)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: "0.9rem", margin: "0 0 4px 0", color: "var(--text-primary)" }}>Campus Hotspots</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                    Items are frequently being lost at: <strong>{topHotspots.join(", ")}</strong>. Be careful with your belongings!
                  </p>
                </div>
              </div>
            )}

            <div className="section-header">
              <i className="fas fa-boxes-stacked"></i>
              <h2>Recently Found on Campus</h2>
            </div>
            {loading ? (
              <SkeletonGrid count={4} />
            ) : foundItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><i className="fas fa-box-open"></i></div>
                <h3>No Found Items</h3>
                <p>There are currently no unclaimed items in the system. Check back later or file a search query.</p>
              </div>
            ) : (
              <div className="grid grid-4">
                {foundItems.map((item, idx) => (
                  <ItemCard key={idx} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Tab */}
        {activeTab === "lost" && (
          <div className="animate-slide-up">
            <SearchBar
              onImageSearch={handleSearchByImage}
              onTextSearch={handleSearchByText}
              loading={loading}
            />

            {searchResults.length > 0 && (
              <div className="mt-6">
                <div className="section-header">
                  <i className="fas fa-circle-nodes text-success"></i>
                  <h3>AI Matching Results</h3>
                  <span className="badge badge-success" style={{ marginLeft: "auto" }}>
                    {searchResults.length} matches
                  </span>
                </div>
                <div className="grid grid-4">
                  {searchResults.map((item, idx) => (
                    <div key={idx} className="relative">
                      <ItemCard item={item} />
                      <div className="match-badge">
                        <span className={`badge ${
                          item.confidence === "High" ? "badge-success"
                            : item.confidence === "Medium" ? "badge-warning"
                            : "badge-primary"
                        }`} style={{ fontSize: "0.6rem" }}>
                          {item.confidence} ({Math.round(item.similarity * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && searchResults.length === 0 && (
              <div className="empty-state mt-6">
                <div className="empty-state-icon"><i className="fas fa-wand-magic-sparkles"></i></div>
                <h3>Multimodal AI Search</h3>
                <p>Upload an image of your lost item or describe it in natural language. The SigLIP neural network will find matching items.</p>
              </div>
            )}
          </div>
        )}

        {/* My Reported Items Tab */}
        {activeTab === "my-reports" && (
          <div className="animate-slide-up">
            <div className="card">
              <div className="card-body" style={{ padding: "var(--space-6)" }}>
                <div className="section-header" style={{ marginBottom: "var(--space-5)" }}>
                  <i className="fas fa-clipboard-list"></i>
                  <h3>My Reports Registry</h3>
                </div>
                {myReportedItems.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon"><i className="fas fa-file-circle-exclamation"></i></div>
                    <p style={{ fontWeight: 600 }}>You have not reported any items yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Photo</th>
                          <th>Description</th>
                          <th>Found Location</th>
                          <th>Date Logged</th>
                          <th>Status</th>
                          <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myReportedItems.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <img
                                src={API.getImageUrl(item.filename)}
                                alt=""
                                style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", objectFit: "cover", border: "1px solid var(--border)" }}
                                onError={(e) => { e.target.src = "/placeholder.svg"; }}
                              />
                            </td>
                            <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                              {item.description || "Found Item"}
                            </td>
                            <td>{item.location}</td>
                            <td>{item.timestamp ? new Date(item.timestamp * 1000).toLocaleDateString() : "Recently"}</td>
                            <td>
                              <span className={`badge ${
                                item.status === "claimed" ? "badge-success"
                                  : item.status === "disputed" ? "badge-danger"
                                  : "badge-primary"
                              }`}>
                                {item.status || "held"}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {item.status === "claimed" && (
                                <button onClick={() => handleFlagDispute(item.filename)} className="btn-danger" style={{ fontSize: "0.7rem", padding: "4px 10px" }}>
                                  <i className="fas fa-triangle-exclamation"></i>Dispute
                                </button>
                              )}
                              {(item.status === "held" || !item.status) && (
                                <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 500 }}>Held at Gates</span>
                              )}
                              {item.status === "disputed" && (
                                <span style={{ color: "var(--danger)", fontSize: "0.7rem", fontWeight: 700 }}>Under Review</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="animate-slide-up max-w-4xl mx-auto">
            <div className={`card chat-workspace view-${mobileChatView}`}>
              {/* Chat list */}
              <div className="chat-list-pane">
                <div style={{ padding: "0 var(--space-4) var(--space-3)", borderBottom: "1px solid var(--border-subtle)" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Conversations</h3>
                </div>
                <div style={{ flex: 1, overflowY: "auto", marginTop: "var(--space-2)" }}>
                  {[
                    { id: 1, name: "Gate 1 Guard Office", lastMsg: "Please bring your ID card to Gate 1.", active: true, unread: true },
                    { id: 2, name: "System Support Desk", lastMsg: "SigLIP model parameters are online.", active: false, unread: false }
                  ].map(c => (
                    <div key={c.id} onClick={() => setMobileChatView("chat")} style={{
                      padding: "var(--space-3) var(--space-4)",
                      background: c.active ? "var(--bg-hover)" : "transparent",
                      cursor: "pointer",
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background var(--transition-fast)"
                    }}>
                      <div className="flex justify-between items-center">
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: c.unread ? "var(--primary-light)" : "var(--text-primary)" }}>{c.name}</span>
                        {c.unread && <span style={{ width: 6, height: 6, background: "var(--primary-light)", borderRadius: "50%" }}></span>}
                      </div>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4 }} className="truncate">{c.lastMsg}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Chat window */}
              <div className="chat-window-pane">
                {/* Chat header */}
                <div style={{ padding: "var(--space-4)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                  <button onClick={() => setMobileChatView("list")} className="chat-back-btn">
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--success)" }}></div>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>Gate 1 Guard Office</span>
                </div>
                {/* Chat messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ alignSelf: "flex-start", background: "var(--bg-surface)", padding: "10px 14px", borderRadius: "0 var(--radius-lg) var(--radius-lg) var(--radius-lg)", maxWidth: "80%", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "0.8rem", margin: 0, color: "var(--text-primary)" }}>Hello. We found a set of keys matching your report under the library stairs. Please bring your ID card to Gate 1 to claim them.</p>
                    <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", display: "block", marginTop: 4, textAlign: "right" }}>10:30 AM</span>
                  </div>
                  <div style={{ alignSelf: "flex-end", background: "var(--primary-subtle)", padding: "10px 14px", borderRadius: "var(--radius-lg) 0 var(--radius-lg) var(--radius-lg)", maxWidth: "80%", border: "1px solid rgba(124,58,237,0.2)" }}>
                    <p style={{ fontSize: "0.8rem", margin: 0, color: "var(--text-primary)" }}>Thank you! I will come by this afternoon after my class.</p>
                    <span style={{ fontSize: "0.6rem", color: "var(--primary-light)", display: "block", marginTop: 4, textAlign: "right" }}>10:45 AM</span>
                  </div>
                </div>
                {/* Chat input */}
                <div style={{ padding: "var(--space-4)", borderTop: "1px solid var(--border)", display: "flex", gap: 12 }}>
                  <input type="text" placeholder="Type a message..." style={{ flex: 1 }} readOnly value="I'm on my way now..." />
                  <button className="btn-primary" style={{ padding: "0 var(--space-4)" }}><i className="fas fa-paper-plane"></i></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {/* Brand Logo - Desktop Only */}
        <div className="sidebar-brand">
          <div style={{
            background: "linear-gradient(135deg, var(--primary), #a855f7)",
            color: "white",
            width: 32,
            height: 32,
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            boxShadow: "0 4px 12px var(--primary-glow)",
          }}>
            <i className="fas fa-search-plus"></i>
          </div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 800,
            margin: 0,
            background: "linear-gradient(135deg, var(--text-primary), var(--primary-light))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            404 Found
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="sidebar-nav-links">
          <button
            onClick={() => { setActiveTab("found"); setSearchResults([]); }}
            className={`nav-item ${activeTab === "found" ? "active" : ""}`}
          >
            <i className="fas fa-house"></i>
            <span>Browse</span>
          </button>

          <button
            onClick={() => { setActiveTab("lost"); setSearchResults([]); }}
            className={`nav-item ${activeTab === "lost" ? "active" : ""}`}
          >
            <i className="fas fa-magnifying-glass"></i>
            <span>AI Search</span>
          </button>

          {/* Central FAB */}
          <button
            onClick={() => setActiveTab("report")}
            className={`nav-fab ${activeTab === "report" ? "active" : ""}`}
          >
            <div className="nav-fab-circle">
              <i className="fas fa-plus"></i>
            </div>
            <span>Report Item</span>
          </button>

          {/* Chat Button */}
          <button
            onClick={() => { setActiveTab("chat"); setSearchResults([]); }}
            className={`nav-item ${activeTab === "chat" ? "active" : ""}`}
          >
            <i className="fas fa-comments"></i>
            <span>Chat</span>
          </button>


          <button
            onClick={() => { setActiveTab("my-reports"); setSearchResults([]); }}
            className={`nav-item ${activeTab === "my-reports" ? "active" : ""}`}
          >
            <i className="fas fa-clipboard-list"></i>
            <span>My Reports</span>
          </button>

          {currentUser.role && currentUser.role !== "student" && (
            <Link
              to={currentUser.role === "admin" ? "/admin" : "/guard"}
              className="nav-item"
              style={{ textDecoration: "none" }}
            >
              <i className="fas fa-shield-halved"></i>
              <span>Control Panel</span>
            </Link>
          )}
        </div>

        {/* User Profile & Logout - Desktop Only */}
        <div className="sidebar-user">
          <div className="flex items-center gap-3" style={{ padding: "4px 0" }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-md)",
              background: "linear-gradient(135deg, var(--primary), #a855f7)",
              color: "white",
              fontWeight: 700,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div style={{ minWidth: 0 }}>
              <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.8rem", display: "block", lineHeight: 1.2 }} className="truncate">
                {currentUser.name || "Explorer"}
              </span>
              <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginTop: 2 }}>
                {currentUser.role === "student" ? `Student • ${currentUser.roll_number}` : currentUser.role || "User"}
              </span>
            </div>
          </div>
          <button
            onClick={() => { API.logout(); window.location.href = "/login"; }}
            className="btn-danger btn-full"
            style={{ padding: "8px", fontSize: "0.75rem", marginTop: "var(--space-2)" }}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
