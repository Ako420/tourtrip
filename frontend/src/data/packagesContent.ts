import type { PackagesContent } from "@/types";
import unsplashImage from "./unsplashImage";

const destination = (id: string, name: string, photoId: string) => {
  return { id, name, imageUrl: unsplashImage(photoId, 500), href: `/packages?to=${encodeURIComponent(name)}` };
};

// Same shape as GET /packages/content. Used until API_URL is set.
const packagesContent: PackagesContent = {
  hero: {
    title: "Flight + Hotel",
    subtitle: "Book them together and save 6%.",
    imageUrl: unsplashImage("photo-1571896349842-33c89424de2d", 2000),
  },
  trust: {
    title: "Why book them together",
    moreLabel: "",
    items: [
      { id: "save", title: "Pay less", description: "Get 6% off the full price of your flight and hotel.", iconName: "tag" },
      { id: "reference", title: "One booking", description: "A single reference covers your flight and your stay.", iconName: "ticket" },
      { id: "flight", title: "Choose your flight", description: "Pick the cheapest or the fastest flight for your dates.", iconName: "plane" },
      { id: "stays", title: "Compare stays", description: "See every hotel with its full package price.", iconName: "bed" },
    ],
  },
  destinations: {
    title: "Popular package destinations",
    items: [
      destination("bali", "Bali", "photo-1537996194471-e657df975ab4"),
      destination("tokyo", "Tokyo", "photo-1540959733332-eab4deabeeaf"),
      destination("dubai", "Dubai", "photo-1512453979798-5ea266f8880c"),
      destination("paris", "Paris", "photo-1511739001486-6bfe10ce785f"),
      destination("rome", "Rome", "photo-1552832230-c0197dd311b5"),
      destination("cape-town", "Cape Town", "photo-1580060839134-75a5edca2e99"),
    ],
  },
  faqs: {
    title: "Flight + Hotel questions",
    items: [
      {
        id: "included",
        question: "What is included in a package?",
        answer: "A round-trip flight for everyone in your group and a hotel stay between your flight dates.",
      },
      {
        id: "discount",
        question: "How does the discount work?",
        answer: "You get 6% off the combined price of the flight and the hotel. The package price is shown before you book.",
      },
      {
        id: "payment",
        question: "Will I be charged when I book?",
        answer: "Online payment is not connected yet, so you will not be charged and no card details are needed.",
      },
      {
        id: "dates",
        question: "Can I stay for different dates than my flights?",
        answer: "Not yet. Your check-in date is your departure date, and your check-out date is your return date.",
      },
    ],
  },
};

export default packagesContent;
