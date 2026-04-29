import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { getCompletedCodes, plannedCredits, CREDIT_CAP } from "@/lib/academic";
import { useEffect, useState } from "react";

const CARDS = [
  { to: "/planner",       title: "Course Planner",  desc: "Pick eligible courses for next semester." },
  { to: "/schedule",      title: "Schedule",        desc: "Resolve section conflicts visually." },
  { to: "/cgpa",          title: "CGPA Predictor",  desc: "What grades hit your target?" },
  { to: "/tasks",         title: "Task Board",      desc: "Kanban for assignments & exams." },
  { to: "/rooms",         title: "Room Finder",     desc: "Find free study rooms right now." },
  { to: "/resources",     title: "Resources",       desc: "Shared notes & study materials." },
  { to: "/consultations", title: "Consultations",   desc: "Book faculty office hours." },
  { to: "/faculty",       title: "Faculty Portal",  desc: "Approve requests, advise students." },
];

export default function Dashboard() {
  const { activeStudent } = useUser();
  const [stats, setStats] = useState({ completed: 0, credits: 0 });

  useEffect(() => {
    if (!activeStudent) return;
    const refresh = () => setStats({
      completed: getCompletedCodes(activeStudent.user_id).length,
      credits: plannedCredits(activeStudent.user_id),
    });
    refresh();
    window.addEventListener("scms:change", refresh);
    return () => window.removeEventListener("scms:change", refresh);
  }, [activeStudent]);

  if (!activeStudent) return null;

  return (
    <div className="space-y-10">
      <header className="border-b border-border pb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Welcome back</p>
        <h2 className="serif text-5xl mt-3">{activeStudent.name}</h2>
        <p className="text-muted-foreground mt-2">
          {activeStudent.dept} · Semester {activeStudent.semester} · CGPA {activeStudent.cgpa?.toFixed(2)}
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Completed courses" value={stats.completed} />
        <Stat label="Planned credits" value={`${stats.credits} / ${CREDIT_CAP}`} />
        <Stat label="Current CGPA" value={activeStudent.cgpa?.toFixed(2) ?? "—"} />
      </section>

      <section>
        <h3 className="serif text-2xl mb-4">Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="paper-card p-5 hover:border-foreground transition-colors group"
            >
              <h4 className="serif text-xl group-hover:underline underline-offset-4">{c.title}</h4>
              <p className="text-sm text-muted-foreground mt-2">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="paper-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="serif text-4xl mt-2">{value}</p>
    </div>
  );
}
