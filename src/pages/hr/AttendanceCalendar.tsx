import { AttendanceRecord, LeaveRequest } from "../../lib/mockApi";

export type CalendarEventKind = "present" | "late" | "on_leave" | "pending" | "approved";
export type CalendarEvent = { id: string; date: string; label: string; kind: CalendarEventKind };

const monthLabel = (month: string) => new Date(`${month}-01T00:00:00`).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
const daysInMonth = (month: string) => new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
const mondayIndex = (date: string) => (new Date(`${date}T00:00:00`).getDay() + 6) % 7;
const localDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const rangeDates = (from: string, to: string) => { const result: string[] = []; const date = new Date(`${from}T00:00:00`); const end = new Date(`${to}T00:00:00`); while (date <= end) { result.push(localDateKey(date)); date.setDate(date.getDate() + 1); } return result; };
const nearbyMonths = (month: string) => [-1, 0, 1].map((offset) => { const date = new Date(`${month}-01T00:00:00`); date.setMonth(date.getMonth() + offset); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; });

export function personalCalendarEvents(asOfDate: string, attendance: AttendanceRecord, leaveRequests: LeaveRequest[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  if (attendance.status !== "absent" && attendance.status !== "on_leave") events.push({ id: `attendance-${attendance.id}`, date: asOfDate, label: attendance.status === "late" ? `Đi trễ · ${attendance.checkIn ?? "—"}` : `Có mặt · ${attendance.checkIn ?? "—"}`, kind: attendance.status });
  leaveRequests.filter((request) => request.status !== "rejected").forEach((request) => rangeDates(request.fromDate, request.toDate).forEach((date) => events.push({ id: `${request.id}-${date}`, date, label: request.status === "approved" ? "Nghỉ đã duyệt" : "Nghỉ chờ duyệt", kind: request.status === "approved" ? "approved" : "pending" })));
  return events;
}

export function teamLeaveCalendarEvents(leaveRequests: LeaveRequest[], employeeName: (employeeId: string) => string): CalendarEvent[] {
  return leaveRequests.filter((request) => request.status !== "rejected").flatMap((request) => rangeDates(request.fromDate, request.toDate).map((date) => ({ id: `${request.id}-${date}`, date, label: `${employeeName(request.employeeId)} · ${request.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}`, kind: request.status === "approved" ? "approved" as const : "pending" as const })));
}

export function AttendanceCalendar({ title, description, month, onMonthChange, events, emptyText = "Không có lịch chấm công hoặc nghỉ phép trong tháng này." }: { title: string; description: string; month: string; onMonthChange: (month: string) => void; events: CalendarEvent[]; emptyText?: string }) {
  const firstDay = `${month}-01`; const blanks = Array.from({ length: mondayIndex(firstDay) }); const days = Array.from({ length: daysInMonth(month) }, (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`); const eventsByDate = new Map<string, CalendarEvent[]>(); const monthOptions = nearbyMonths(month); events.forEach((event) => eventsByDate.set(event.date, [...(eventsByDate.get(event.date) ?? []), event]));
  return <article className="detail-section attendance-calendar"><div className="section-heading"><div><h3>{title}</h3><p>{description}</p></div><select aria-label="Chọn tháng lịch" className="compact-select" value={month} onChange={(event) => onMonthChange(event.target.value)}>{monthOptions.map((option) => <option key={option} value={option}>{monthLabel(option)}</option>)}</select></div><div className="calendar-month-label">{monthLabel(month)}</div><div className="calendar-weekdays">{["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-grid">{blanks.map((_, index) => <div className="calendar-day is-blank" key={`blank-${index}`} />)}{days.map((date) => <div className={`calendar-day ${eventsByDate.has(date) ? "has-event" : ""}`} key={date}><strong>{Number(date.slice(-2))}</strong><div>{(eventsByDate.get(date) ?? []).slice(0, 2).map((event) => <span title={event.label} className={`calendar-event ${event.kind}`} key={event.id}>{event.label}</span>)}</div></div>)}</div>{!events.some((event) => event.date.startsWith(month)) && <p className="calendar-empty">{emptyText}</p>}<div className="calendar-legend"><span><i className="present" /> Có mặt</span><span><i className="late" /> Đi trễ</span><span><i className="approved" /> Nghỉ đã duyệt</span><span><i className="pending" /> Chờ duyệt</span></div></article>;
}
