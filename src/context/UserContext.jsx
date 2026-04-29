import { createContext, useContext, useEffect, useState } from "react";
import { getTable } from "@/lib/db";

const UserContext = createContext(null);
const ACTIVE_KEY = "scms.activeUserId";

export function UserProvider({ children }) {
  const [students, setStudents] = useState([]);
  const [activeId, setActiveId] = useState(() => {
    const raw = localStorage.getItem(ACTIVE_KEY);
    return raw ? Number(raw) : 1;
  });

  useEffect(() => {
    const load = () => {
      const users = getTable("USERS");
      const studs = getTable("REGULAR_STUDENT").map((s) => ({
        ...s,
        ...users.find((u) => u.user_id === s.user_id),
      }));
      setStudents(studs);
    };
    load();
    window.addEventListener("scms:change", load);
    return () => window.removeEventListener("scms:change", load);
  }, []);

  const switchUser = (id) => {
    localStorage.setItem(ACTIVE_KEY, String(id));
    setActiveId(Number(id));
  };

  const activeStudent = students.find((s) => s.user_id === activeId) ?? students[0];

  return (
    <UserContext.Provider value={{ students, activeStudent, switchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
