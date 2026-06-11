export const RSVP_URL = "https://partiful.com/e/q0vog3c2ldApTwNfSQbL?c=8NqPm6FG";
export const AFTER_PARTY_TICKETS_URL = "https://posh.vip/e/in-bituin-after-party";

const directionsTo = (destination: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

export const HELLO_MARKET_DIRECTIONS_URL = directionsTo(
  "Hello Market, 46 Market St, New York, NY 10002",
);
export const KIND_REGARDS_DIRECTIONS_URL = directionsTo(
  "Kind Regards, 152 Ludlow St, New York, NY 10002",
);
export const INSTAGRAM_URL = "https://www.instagram.com/inbituin.us/";
export const INSTAGRAM_HANDLE = "@inbituin.us";
