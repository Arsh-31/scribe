export const formatNoteDate = (dateInput: Date | string | number): string => {
  let date: Date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === "string" || typeof dateInput === "number") {
    date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date in formatNoteDate:", dateInput);
      return "Unknown";
    }
  } else {
    console.warn("Unsupported date input:", dateInput);
    return "Unknown";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const relativeTime = (dateInput: Date | string | number): string => {
  let date: Date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === "string" || typeof dateInput === "number") {
    date = new Date(dateInput);

    if (isNaN(date.getTime())) {
      console.warn(`Invalid date: ${dateInput}`);
      return "Recently";
    }
  } else {
    return "Recently";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatNoteDate(date);
};
