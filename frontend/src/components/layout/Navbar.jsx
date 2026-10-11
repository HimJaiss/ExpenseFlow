
import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Search,
  ChevronDown,
  CheckCheck,
  ReceiptText,
  Clock,
  CheckCircle2,
  X,
} from "lucide-react";

import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const notificationRef = useRef(null);

  // Role-based welcome notifications.
  useEffect(() => {
    const roleNotifications = {
      employee: [
        {
          id: 1,
          title: "Welcome to ExpenseFlow",
          message:
            "You can create and track your expense vouchers from your dashboard.",
          time: "Just now",
          read: false,
          icon: "receipt",
        },
      ],
      director: [
        {
          id: 1,
          title: "Welcome to ExpenseFlow",
          message:
            "Review pending expense vouchers and manage approvals from your dashboard.",
          time: "Just now",
          read: false,
          icon: "clock",
        },
      ],
      accounts: [
        {
          id: 1,
          title: "Welcome to ExpenseFlow",
          message:
            "Manage approved vouchers and track expense processing from your dashboard.",
          time: "Just now",
          read: false,
          icon: "check",
        },
      ],
    };

    setNotifications(roleNotifications[user?.role] || []);
  }, [user?.role]);

  // Keyboard shortcuts and notification dismissal.
  useEffect(() => {
    function handleKeyDown(event) {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }

      if (event.key === "Escape") {
        setIsOpen(false);
        searchRef.current?.blur();
      }
    }

    function handleOutsideClick(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  }

  function getNotificationIcon(type) {
    switch (type) {
      case "clock":
        return <Clock size={18} />;
      case "check":
        return <CheckCircle2 size={18} />;
      default:
        return <ReceiptText size={18} />;
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      searchRef.current?.focus();
      return;
    }

    // The voucher list should listen for this event and filter its records.
    window.dispatchEvent(
      new CustomEvent("expenseflow:search", {
        detail: { query },
      })
    );
  }

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchTerm(value);

    // Allow the voucher list to update while the user types.
    window.dispatchEvent(
      new CustomEvent("expenseflow:search", {
        detail: { query: value.trim() },
      })
    );
  }

  function clearSearch() {
    setSearchTerm("");

    window.dispatchEvent(
      new CustomEvent("expenseflow:search", {
        detail: { query: "" },
      })
    );

    searchRef.current?.focus();
  }

  const roleLabel =
    user?.role === "director"
      ? "Director portal"
      : user?.role === "accounts"
        ? "Accounts portal"
        : "Employee portal";

  return (
    <header className="topbar">
      <div className="crumb">
        <span>Workspace</span>
        <span className="crumb-slash">/</span>
        <strong>{roleLabel}</strong>
      </div>

      <div className="topbar-actions">
        {/* Search */}
        <form
          className="topbar-search"
          role="search"
          onSubmit={handleSearchSubmit}
        >
          <Search size={16} aria-hidden="true" />

          <input
            ref={searchRef}
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search vouchers..."
            aria-label="Search ExpenseFlow"
            autoComplete="off"
          />

          {searchTerm ? (
            <button
              type="button"
              className="search-clear"
              onClick={clearSearch}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={14} />
            </button>
          ) : (
            <kbd>Ctrl K</kbd>
          )}
        </form>

        <ThemeToggle />

        {/* Notifications */}
        <div className="notification-wrapper" ref={notificationRef}>
          <button
            type="button"
            className="icon-button notification-button"
            aria-label={`Notifications: ${unreadCount} unread`}
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={() => setIsOpen((previous) => !previous)}
          >
            <Bell size={18} />

            {unreadCount > 0 && (
              <>
                <i className="notification-dot" />
                <span className="notification-count">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              </>
            )}
          </button>

          {isOpen && (
            <div
              className="notification-dropdown"
              role="dialog"
              aria-label="Notifications"
            >
              <div className="notification-header">
                <div>
                  <h3>Notifications</h3>
                  <p>
                    {unreadCount === 0
                      ? "You're all caught up"
                      : `${unreadCount} unread notification${
                          unreadCount === 1 ? "" : "s"
                        }`}
                  </p>
                </div>

                <button
                  type="button"
                  className="notification-close"
                  aria-label="Close notifications"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {notifications.length > 0 ? (
                <>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="notification-mark-all"
                      onClick={markAllAsRead}
                    >
                      <CheckCheck size={15} />
                      Mark all as read
                    </button>
                  )}

                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        className={`notification-item ${
                          notification.read ? "is-read" : "is-unread"
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <span className="notification-icon">
                          {getNotificationIcon(notification.icon)}
                        </span>

                        <span className="notification-content">
                          <strong>{notification.title}</strong>
                          <span>{notification.message}</span>
                          <small>{notification.time}</small>
                        </span>

                        {!notification.read && (
                          <span className="notification-unread-dot" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="notification-empty">
                  <Bell size={28} />
                  <strong>No notifications yet</strong>
                  <span>New updates will appear here.</span>
                </div>
              )}

              <div className="notification-footer">
                ExpenseFlow Notifications
              </div>
            </div>
          )}
        </div>

        {/* Logged-in user */}
        <div className="topbar-user">
          <div className="avatar avatar-small">
            {user?.name
              ?.split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </div>

          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}
