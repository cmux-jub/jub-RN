import type { AppEventName } from '@/services/tracking/events';

type TrackPayload = Record<string, string | number | boolean | null | undefined>;

export function track(eventName: AppEventName, payload?: TrackPayload) {
  console.log('[track]', eventName, payload ?? {});
}
