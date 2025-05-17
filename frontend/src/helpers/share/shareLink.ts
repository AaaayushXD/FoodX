export async function handleShare<T extends string>(type: T) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: type,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    alert("Web Share API is not supported in this browser.");
  }
}
