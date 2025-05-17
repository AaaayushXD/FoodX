import dayjs, { Dayjs } from "dayjs";

export const getRemainingTime = (time: Dayjs) => {
  const now = dayjs();
  const specificTime = dayjs(time);
  const diff = now.diff(specificTime);
  if (diff <= 0) {
    return "Time is up!"; // Return if the time has passed
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // Remaining days
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24); // Remaining hours
  const minutes = Math.floor((diff / (1000 * 60)) % 60); // Remaining minutes
  const seconds = Math.floor((diff / 1000) % 60); // Remaining seconds

  if (days && hours && minutes) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  if (hours && minutes) {
    return ` ${hours}h ${minutes}m`;
  }
  if (minutes && seconds) {
    return ` ${minutes}m ${seconds}s`;
  }
  if (seconds) {
    return ` ${minutes}s`;
  }
};
