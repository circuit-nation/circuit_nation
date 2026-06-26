export type GlobeEvent = {
  id: string;
  title: string;
  sportName: string;
  sportColor: string;
  location: string;
  circuit?: string;
  startAt: string;
  endAt: string;
  watchUrl: string;
  watchLabel: string;
};

export type EventLocation = {
  eventId: string;
  title: string;
  latitude: number;
  longitude: number;
};
