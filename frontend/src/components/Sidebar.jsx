import { Link, useNavigate } from "react-router-dom";
import API from "../api/apiClient";

export default function Sidebar({ activeSection, onSectionChange }) {
  const navigate = useNavigate();
  const user = API.getCurrentUser() || { name: "Admin", email: "admin@iiitd.ac.in", role: "admin" };

  const sections = [
    { id: "dashboard", icon: "fa-chart-pie", title: "Dashboard" },
    { id: "items", icon: "fa-boxes-stacked", title: "Items" },
    { id: "disputes", icon: "fa-gavel", title: "Disputes" },
    { id: "analytics", icon: "fa-chart-line", title: "Trends" },
    { id: "reports", icon: "fa-file-invoice", title: "Reports" },
  ];

  const handleLogout = () => {
    API.logout();
    navigate("/login");
  };

  return (
    <nav className="bottom-nav">
      {/* Brand Logo - Desktop Only */}
      <div className="sidebar-brand">
        <img src="/logo.png" alt="404 Found Logo" style={{
          width: 32,
          height: 32,
          borderRadius: "var(--radius-md)",
          objectFit: "contain",
          boxShadow: "0 4px 12px var(--primary-glow)",
        }} />
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

        {/* Admin Sections */}
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`nav-item ${activeSection === section.id ? "active" : ""}`}
          >
            <i className={`fas ${section.icon}`}></i>
            <span>{section.title}</span>
          </button>
        ))}
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
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.8rem", display: "block", lineHeight: 1.2 }} className="truncate">
              {user.name}
            </span>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginTop: 2 }}>
              {user.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn-danger btn-full"
          style={{ padding: "8px", fontSize: "0.75rem", marginTop: "var(--space-2)" }}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
