import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { resetAll } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  LayoutDashboard, BookOpen, CalendarClock, Calculator, KanbanSquare,
  DoorOpen, Library, CalendarCheck, GraduationCap, RotateCcw, Plus, CheckSquare,
} from "lucide-react";

const NAV = [
  { to: "/",              label: "Dashboard",     icon: LayoutDashboard },
  { to: "/planner",       label: "Course Planner", icon: BookOpen },
  { to: "/schedule",      label: "Schedule",       icon: CalendarClock },
  { to: "/cgpa",          label: "CGPA Predictor", icon: Calculator },
  { to: "/tasks",         label: "Tasks",          icon: KanbanSquare },
  { to: "/courses",       label: "My Courses",     icon: CheckSquare },
  { to: "/rooms",         label: "Rooms",          icon: DoorOpen },
  { to: "/resources",     label: "Resources",      icon: Library },
  { to: "/consultations", label: "Consultations",  icon: CalendarCheck },
  { to: "/faculty",       label: "Faculty Portal", icon: GraduationCap },
  { to: "/students/new",  label: "Create Student", icon: Plus },
];

export default function Layout() {
  const { students, activeStudent, switchUser } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 border-r border-border bg-sidebar hidden md:flex md:flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="serif text-3xl leading-none">SCMS</h1>
          <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">
            Smart Course Management
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm rounded-sm transition-colors ${
                  to === "/students/new"
                    ? isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-primary/10 text-primary hover:bg-primary/15"
                    : isActive
                      ? "bg-foreground text-background"
                      : "text-foreground/75 hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={() => { if (confirm("Reset all data to seed?")) resetAll(); }}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-2" /> Reset data
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/60">
          <div className="md:hidden">
            <h1 className="serif text-2xl">SCMS</h1>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:block">
              Viewing as
            </span>
            <Select value={String(activeStudent?.user_id ?? "")} onValueChange={(v) => switchUser(v)}>
              <SelectTrigger className="w-[260px] bg-background">
                <SelectValue placeholder="Select student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.user_id} value={String(s.user_id)}>
                    {s.name} · {s.dept} · Sem {s.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="default" size="sm" className="ml-2 hidden sm:inline-flex" onClick={() => navigate(`/students/${activeStudent?.user_id}/edit`)}>
              Edit
            </Button>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
