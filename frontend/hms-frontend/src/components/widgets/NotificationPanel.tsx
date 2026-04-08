import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNotifications } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";

export default function NotificationPanel() {
  const { token } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const getUserIdFromToken = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.id || payload.userId || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const load = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;

      const data = await getNotifications(userId);
      setItems(data || []);
    };

    load();

    // 🔁 Poll every 10 sec
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="relative">

      <button onClick={() => setOpen(!open)} className="relative">
        <Bell />

        {items.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {items.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl p-3 z-50">
          <h4 className="font-semibold mb-2">Notifications</h4>

          {items.length === 0 ? (
            <div className="text-sm text-gray-500">
              No notifications
            </div>
          ) : (
            items.slice(0, 5).map((n, i) => (
              <div key={i} className="text-sm border-b py-2">
                {n.message}
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}