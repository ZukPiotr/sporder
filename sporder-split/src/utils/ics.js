// src/utils/ics.js

function toICS(ev) {
  const pad = (n) => String(n).padStart(2, "0");
  const dt = (d) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(
      d.getUTCDate()
    )}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  const end = new Date(ev.when);
  end.setHours(end.getHours() + 2);
  const body = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SPORDER//PL\nBEGIN:VEVENT\nUID:sporder-${
    ev.id
  }@local\nDTSTAMP:${dt(new Date())}\nDTSTART:${dt(ev.when)}\nDTEND:${dt(
    end
  )}\nSUMMARY:${ev.sport} — ${ev.place}\nLOCATION:${ev.city}\nDESCRIPTION:SPORDER\nEND:VEVENT\nEND:VCALENDAR`;
  return new Blob([body], { type: "text/calendar" });
}

export function downloadICS(ev, filename) {
  const blob = toICS(ev);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}