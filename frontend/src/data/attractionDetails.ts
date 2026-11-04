import type { Attraction, AttractionDetails, HotelReview, TicketOption } from "@/types";

const CHILD_SHARE = 0.6;

const categoryText: Record<Attraction["category"], { intro: string; highlights: string[] }> = {
  landmarks: {
    intro: "one of the sights that defines a trip here. Take your time, learn the story behind it and enjoy the views",
    highlights: ["See an iconic landmark up close", "Learn the story with clear visitor information", "Great photo spots"],
  },
  nature: {
    intro: "a chance to slow down and enjoy the landscape. Fresh air, big views and plenty of time to take it all in",
    highlights: ["Beautiful natural scenery", "Relaxed pace for all ages", "Bring your camera"],
  },
  adventure: {
    intro: "an experience you will talk about long after you get home, led by a friendly local team who look after the details",
    highlights: ["A once-in-a-lifetime experience", "Led by an experienced local team", "Small groups"],
  },
  city: {
    intro: "a great way to get to know the city, its streets and its everyday life, with time to stop along the way",
    highlights: ["See the city from a local angle", "Easy to fit into your day", "Plenty of photo stops"],
  },
};

const reviewTemplates: Omit<HotelReview, "id" | "score">[] = [
  { author: "Amara O.", country: "Nigeria", stayDate: "October 2026", title: "Worth it", text: "Well organised from start to finish. The ticket was easy to use and there was plenty of time to look around." },
  { author: "Lukas M.", country: "Germany", stayDate: "September 2026", title: "A highlight of our trip", text: "Better than we expected. Go early if you can, because it gets busier later in the day." },
  { author: "Priya S.", country: "India", stayDate: "August 2026", title: "Good value", text: "Clear instructions and friendly staff. We were glad we booked ahead instead of queuing." },
  { author: "Sofia R.", country: "Brazil", stayDate: "July 2026", title: "Loved it", text: "Our family enjoyed every minute. Wear comfortable shoes and bring water." },
  { author: "Daniel K.", country: "Kenya", stayDate: "June 2026", title: "Would do it again", text: "A memorable day out. It was a little crowded, but the experience made up for it." },
];

const getDurationText = (duration: string) => {
  return /^\d/.test(duration) ? `about ${duration}` : `a ${duration.toLowerCase()}`;
};

const clampScore = (score: number) => Math.min(Math.round(score * 10) / 10, 5);

const buildTicket = (
  id: string,
  name: string,
  description: string,
  includes: string[],
  adultPrice: number,
): TicketOption => {
  return { id, name, description, includes, adultPrice, childPrice: Math.round(adultPrice * CHILD_SHARE) };
};

// Adds sample details, in the same shape as GET /attractions/:slug. Used until API_URL is set.
const withAttractionDetails = (attraction: Attraction): AttractionDetails => {
  const { name, city, country, duration, rating, freeCancellation } = attraction;
  const price = Number(attraction.price);
  const seed = Number(attraction.id);
  const text = categoryText[attraction.category];

  return {
    ...attraction,
    description: `${name} is ${text.intro}. Plan for ${getDurationText(duration)} to enjoy it properly.`,
    highlights: text.highlights,
    address: `${city}, ${country}`,
    tickets: [
      buildTicket("standard", "Standard ticket", "Entry for your chosen date.", ["Entry ticket", "Mobile ticket"], price),
      buildTicket(
        "guided",
        "Guided experience",
        "Join a small group with a local guide.",
        ["Entry ticket", "Local guide", "Small group"],
        Math.round(price * 1.6),
      ),
      buildTicket(
        "private",
        "Private experience",
        "Just your group, at your pace.",
        ["Entry ticket", "Private guide", "Flexible start time"],
        Math.round(price * 2.8),
      ),
    ],
    reviewScores: [
      { id: "value", label: "Value for money", score: clampScore(rating - 0.1) },
      { id: "experience", label: "Experience", score: clampScore(rating + 0.1) },
      { id: "organisation", label: "Organisation", score: clampScore(rating) },
      { id: "access", label: "Ease of access", score: clampScore(rating - 0.2) },
    ],
    reviews: reviewTemplates.map((review, position) => ({
      ...reviewTemplates[(seed + position) % reviewTemplates.length],
      id: `${attraction.id}-${review.author}`,
      score: clampScore(rating + (position % 3) * 0.1 - 0.1),
    })),
    policies: [
      { id: "ticket", title: "Your ticket", description: "Show your mobile ticket at the entrance. Printing is not needed.", iconName: "ticket" },
      {
        id: "cancellation",
        title: "Cancellation",
        description: freeCancellation
          ? "Free cancellation up to 24 hours before your visit."
          : "This ticket cannot be cancelled or changed after booking.",
        iconName: "ban",
      },
      { id: "id", title: "What to bring", description: "Bring a photo ID, comfortable shoes and water.", iconName: "id-card" },
      { id: "access", title: "Accessibility", description: "Access varies by area. Contact support before you visit if you need help.", iconName: "wheelchair" },
    ],
    nearby: [
      { id: "centre", name: `${city} centre`, distance: `${(seed % 4) + 1}.${seed % 9} km`, iconName: "building" },
      { id: "station", name: "Nearest public transport", distance: `${((seed % 5) + 3) * 100} m`, iconName: "train" },
      { id: "airport", name: "International airport", distance: `${12 + seed * 3} km`, iconName: "plane" },
    ],
  };
};

export default withAttractionDetails;
