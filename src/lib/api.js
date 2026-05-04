// PHP API base URL — change this if your XAMPP setup differs.
const BASE = "http://localhost/scms-api/api";

async function fetchJSON(endpoint) {
  const res = await fetch(`${BASE}/${endpoint}`);
  if (!res.ok) throw new Error(`API ${endpoint}: ${res.status}`);
  return res.json();
}

async function postJSON(endpoint, body) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API POST ${endpoint}: ${res.status}`);
  return res.json();
}

async function putJSON(endpoint, body) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API PUT ${endpoint}: ${res.status}`);
  return res.json();
}

async function deleteJSON(endpoint, body) {
  const res = await fetch(`${BASE}/${endpoint}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API DELETE ${endpoint}: ${res.status}`);
  return res.json();
}

// ---------- Table-specific fetchers ----------

// Maps our internal table names to PHP endpoints + response transforms.
const TABLE_ENDPOINTS = {
  USERS:              { endpoint: "users.php",              transform: (rows) => rows.map(r => ({ ...r, user_id: Number(r.user_id), is_guest: Number(r.is_guest) })) },
  REGULAR_STUDENT:    { endpoint: "students.php",           transform: (rows) => rows.map(r => ({ ...r, user_id: Number(r.user_id), student_id: Number(r.student_id), cgpa: parseFloat(r.cgpa), advisor_id: Number(r.advisor_id) })) },
  FACULTY:            { endpoint: "faculty.php",            transform: (rows) => rows.map(r => ({ ...r, user_id: Number(r.user_id), faculty_id: Number(r.faculty_id), is_active: Number(r.is_active) })) },
  ROOM:               { endpoint: "rooms.php",              transform: (rows) => rows.map(r => ({ ...r, room_id: Number(r.room_id) })) },
  COURSE:             { endpoint: "courses.php",            transform: (rows) => rows.map(r => ({ ...r, credit_hours: Number(r.credit_hours), capacity: Number(r.capacity), semester: String(r.semester) })) },
  PREREQUISITE:       { endpoint: "prerequisites.php",      transform: (rows) => rows },
  SECTION:            { endpoint: "sections.php",           transform: (rows) => rows.map(r => ({ ...r, faculty_id: Number(r.faculty_id), room_id: Number(r.room_id) })) },
  ENROLLMENT:         { endpoint: "enrollments.php",        transform: (rows) => rows.map(r => ({ ...r, student_id: Number(r.student_id), grade_point: parseFloat(r.grade_point) })) },
  PLANNED_ENROLLMENT: { endpoint: "planned_enrollments.php", transform: (rows) => rows.map(r => ({ ...r, student_id: Number(r.student_id) })) },
  TASK:               { endpoint: "tasks.php",              transform: (rows) => rows.map(r => ({ ...r, t_id: Number(r.t_id), student_id: Number(r.student_id) })) },
  CONSULTATION:       { endpoint: "consultations.php",      transform: (rows) => rows.map(r => ({ ...r, faculty_id: Number(r.faculty_id) })) },
  RESOURCES:          { endpoint: "resources.php",          transform: (rows) => rows.map(r => ({ ...r, resource_id: Number(r.resource_id), uploaded_by: Number(r.uploaded_by) })) },
};

/**
 * Fetch a single table from the API and return the rows.
 */
export async function fetchTable(tableName) {
  const cfg = TABLE_ENDPOINTS[tableName];
  if (!cfg) {
    console.warn(`No API endpoint for table: ${tableName}`);
    return [];
  }
  try {
    const data = await fetchJSON(cfg.endpoint);
    return cfg.transform(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(`Failed to fetch ${tableName}:`, err);
    return [];
  }
}

/**
 * Fetch all tables in parallel and return a map { TABLE_NAME: rows[] }.
 */
export async function fetchAllTables() {
  const names = Object.keys(TABLE_ENDPOINTS);
  const results = await Promise.allSettled(names.map((n) => fetchTable(n)));
  const map = {};
  names.forEach((name, i) => {
    map[name] = results[i].status === "fulfilled" ? results[i].value : [];
  });
  return map;
}

// ---------- Write helpers ----------

export async function apiAddTask(task) {
  return postJSON("tasks.php", task);
}

export async function apiUpdateTask(task) {
  return putJSON("tasks.php", task);
}

export async function apiDeleteTask(t_id) {
  return deleteJSON("tasks.php", { t_id });
}

export async function apiAddPlannedEnrollment(row) {
  return postJSON("planned_enrollments.php", row);
}

export async function apiDeletePlannedEnrollment(student_id, course_code) {
  return deleteJSON("planned_enrollments.php", { student_id, course_code });
}

export async function apiAddResource(resource) {
  return postJSON("resources.php", resource);
}

export async function apiDeleteResource(resource_id) {
  return deleteJSON("resources.php", { resource_id });
}

export { postJSON, putJSON, deleteJSON, fetchJSON };
