import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/apiClient";

export default function Header() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const user = API.getCurrentUser();

  const handleLogout = () => {
    API.logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "guard") return "/guard";
    return "/";
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* Brand logo */}
        <Link to={getDashboardLink()} className="flex items-center gap-3 no-underline" style={{ textDecoration: "none" }}>
          <img src="/logo.png" alt="404 Found Logo" style={{
            width: 38,
            height: 38,
            borderRadius: "var(--radius-md)",
            objectFit: "contain",
            boxShadow: "0 4px 12px var(--primary-glow)",
            transition: "transform var(--transition-base)",
          }} />
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "1.2rem",
            fontWeight: 800,
            margin: 0,
            background: "linear-gradient(135deg, var(--text-primary), var(--primary-light))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            404 Found
          </h1>
        </Link>

        {/* User context menu */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowDropdown(false); }}
                className="btn-icon"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "var(--radius-xl)",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className="fas fa-bell"></i>
                {/* Unread badge dot */}
                <span style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  background: "var(--danger)",
                  borderRadius: "50%",
                  boxShadow: "0 0 0 2px var(--bg-surface)",
                }}></span>
              </button>

              {/* Notifications Popover Dropdown */}
              {showNotifications && (
                <div className="dropdown notification-dropdown">
                  <div style={{ padding: "0 0 var(--space-2) 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-primary)" }}>Notifications</span>
                    <span className="badge badge-primary" style={{ fontSize: "0.6rem" }}>1 New</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", maxHeight: 240, overflowY: "auto" }}>
                    {[
                      { id: 1, title: "SigLIP Match Found", message: "A high-confidence visual match has been detected for your lost keys.", time: "2h ago", read: false },
                      { id: 2, title: "Report Authenticated", message: "Your reported item 'Dell Laptop Charger' has been verified by Gate Security.", time: "1d ago", read: true }
                    ].map(n => (
                      <div key={n.id} style={{
                        padding: "var(--space-2) var(--space-3)",
                        background: n.read ? "transparent" : "var(--primary-subtle)",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid var(--border-subtle)",
                        textAlign: "left",
                      }}>
                        <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>{n.title}</span>
                          <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>{n.time}</span>
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.3 }}>{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="relative">
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 cursor-pointer select-none"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                padding: "6px 12px",
                borderRadius: "var(--radius-xl)",
                transition: "all var(--transition-fast)",
              }}
            >
              {/* User avatar */}
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
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="sm-hidden">
                <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem", display: "block", lineHeight: 1.2 }}>
                  {user.name}
                </span>
                <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginTop: 2 }}>
                  {user.role === "student" ? `Student • ${user.roll_number}` : user.role}
                </span>
              </div>

              <span style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
                <i className={`fas fa-chevron-${showDropdown ? "up" : "down"}`}></i>
              </span>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="dropdown">
                <div style={{ padding: "var(--space-3) var(--space-4)", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.85rem" }}>{user.name}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.7rem", marginTop: 2 }}>{user.email}</p>
                </div>

                <div style={{ padding: "var(--space-1)" }}>
                  {user.role !== "student" && (
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setShowDropdown(false)}
                      className="dropdown-item"
                    >
                      <i className="fas fa-gauge" style={{ width: 16 }}></i>My Dashboard
                    </Link>
                  )}

                  {user.role === "admin" && (
                    <Link
                      to="/"
                      onClick={() => setShowDropdown(false)}
                      className="dropdown-item"
                    >
                      <i className="fas fa-home" style={{ width: 16 }}></i>Student Panel View
                    </Link>
                  )}

                  <div className="dropdown-divider"></div>

                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleLogout();
                    }}
                    className="dropdown-item dropdown-item-danger"
                  >
                    <i className="fas fa-sign-out-alt" style={{ width: 16 }}></i>Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
          <Link
            to="/login"
            className="btn-primary"
            style={{ textDecoration: "none", fontSize: "0.85rem", padding: "8px 20px" }}
          >
            Access Platform
          </Link>
        )}
      </div>
    </header>
  );
}
