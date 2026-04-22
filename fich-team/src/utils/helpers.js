export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function getYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

export function staggerDelay(index, base = 0.08) {
  return index * base;
}

export function buildModalUrl(base, modalId) {
  return `${base}?modal=${modalId}`;
}

export function getModalParam() {
  return new URLSearchParams(window.location.search).get('modal');
}
