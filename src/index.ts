// @ts-expect-error chrome issue
import type { chrome } from 'chrome';

declare global {
  interface Window {
    chrome: typeof chrome;
  }
}

export {};
