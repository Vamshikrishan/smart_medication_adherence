export function getReminderTime(time) {
  switch (time) {
    case "Morning":
      return "08:00";
    case "Afternoon":
      return "13:00";
    case "Night":
      return "20:00";
    default:
      return "08:00";
  }
}
