import type { CarsContent } from "@/types";
import unsplashImage from "./unsplashImage";

// Same shape as GET /cars/content. Used until API_URL is set.
const carsContent: CarsContent = {
  hero: {
    title: "Car Rentals",
    imageUrl: unsplashImage("photo-1568605117036-5fe5e7bab0b7", 2000),
  },
  trust: {
    title: "Rent with confidence",
    moreLabel: "Register now",
    moreHref: "/signup",
    items: [
      { id: "compare", title: "Compare in one place", description: "See cars from different suppliers side by side.", iconName: "search" },
      { id: "price", title: "Clear pricing", description: "See the total for your rental before you book.", iconName: "tag" },
      { id: "cancel", title: "Flexible options", description: "Filter for cars with free cancellation.", iconName: "check" },
      { id: "support", title: "Help when you need it", description: "Our team can help before and during your trip.", iconName: "headset" },
    ],
  },
  types: {
    title: "Popular car rental types",
    items: [
      { id: "economy", label: "Economy", detail: "Easy to park", imageUrl: unsplashImage("photo-1549317661-bd32c8ce0db2", 600) },
      { id: "compact", label: "Compact", detail: "Great for city trips", imageUrl: unsplashImage("photo-1541899481282-d53bffe3c35d", 600) },
      { id: "sedan", label: "Sedan", detail: "Comfortable for longer drives", imageUrl: unsplashImage("photo-1502877338535-766e1452684a", 600) },
      { id: "suv", label: "SUV", detail: "Room for family and bags", imageUrl: unsplashImage("photo-1519641471654-76ce0107ad1b", 600) },
      { id: "van", label: "Van", detail: "Space for groups", imageUrl: unsplashImage("photo-1469854523086-cc02fe5d8800", 600) },
      { id: "luxury", label: "Luxury", detail: "For a special trip", imageUrl: unsplashImage("photo-1503376780353-7e6692767b70", 600) },
    ],
  },
  cities: {
    title: "Popular car rental cities",
    items: [
      { id: "dubai", name: "Dubai", fromPrice: 29, currency: "USD", imageUrl: unsplashImage("photo-1512453979798-5ea266f8880c", 500) },
      { id: "cape-town", name: "Cape Town", fromPrice: 21, currency: "USD", imageUrl: unsplashImage("photo-1580060839134-75a5edca2e99", 500) },
      { id: "rome", name: "Rome", fromPrice: 26, currency: "USD", imageUrl: unsplashImage("photo-1552832230-c0197dd311b5", 500) },
      { id: "bali", name: "Bali", fromPrice: 18, currency: "USD", imageUrl: unsplashImage("photo-1537996194471-e657df975ab4", 500) },
      { id: "tokyo", name: "Tokyo", fromPrice: 34, currency: "USD", imageUrl: unsplashImage("photo-1540959733332-eab4deabeeaf", 500) },
      { id: "marrakech", name: "Marrakech", fromPrice: 19, currency: "USD", imageUrl: unsplashImage("photo-1597212618440-806262de4f6b", 500) },
    ],
  },
  faqs: {
    title: "Car rental questions",
    items: [
      { id: "bring", question: "What do I need to bring to pick up the car?", answer: "Usually a valid driving license, a passport or ID, and a card in the main driver's name. Check your rental details, as this varies by supplier and country." },
      { id: "deposit", question: "Do I need to pay a deposit?", answer: "Most suppliers hold a deposit on a card at pick-up and release it after you return the car in good condition." },
      { id: "age", question: "Is there a minimum driver age?", answer: "This depends on the supplier and country. Drivers under 25 or over 69 may pay an extra fee." },
      { id: "fuel", question: "How does fuel work?", answer: "Many rentals are full to full, which means you collect the car with a full tank and return it full." },
      { id: "cancel", question: "Can I cancel my booking?", answer: "Cars marked as free cancellation can be cancelled for free until the time shown. Other rentals follow the supplier's rules." },
    ],
  },
};

export default carsContent;
