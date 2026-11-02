/** Only one audio source plays at a time across the page. */
let stopCurrent: (() => void) | null = null;

export function claimAudio(stop: () => void) {
  if (stopCurrent !== stop) stopCurrent?.();
  stopCurrent = stop;
}

export function releaseAudio(stop: () => void) {
  if (stopCurrent === stop) stopCurrent = null;
}
