import type { CarsContent } from "@/types";
import { carSuppliers } from "./carOffers";
import unsplashImage from "./unsplashImage";

const toLocationHref = (location: string) => `/cars?location=${encodeURIComponent(location)}#search`;

// Same shape as GET /cars/content. Used until API_URL is set.
const carsContent: CarsContent = {
  hero: {
    title: "Car Rentals",
    imageUrl: unsplashImage("photo-1568605117036-5fe5e7bab0b7", 2000),
  },
  offer: {
    title: "Join Hotel Jr for free",
    points: ["Fill in booking forms faster with your saved details", "Chat with the travel assistant about your trip"],
    ctaLabel: "Create an account",
    ctaHref: "/signup?next=%2Fcars",
  },
  benefits: [
    { id: "compare", title: "Compare in one place", description: "See cars from different suppliers side by side.", iconName: "search" },
    { id: "price", title: "Clear pricing", description: "See the total for your rental before you book.", iconName: "tag" },
    { id: "cancel", title: "Flexible options", description: "Filter for cars with free cancellation.", iconName: "check" },
    { id: "support", title: "Help with your trip", description: "Find answers or send a question from Customer support.", iconName: "headset" },
  ],
  sectionLinks: [
    { label: "Popular cities", href: "#cities" },
    { label: "User reviews", href: "#reviews" },
    { label: "Car rental suppliers", href: "#suppliers" },
    { label: "FAQs", href: "#faqs" },
    { label: "Guide", href: "#guide" },
  ],
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
  reviews: {
    title: "Car rental user reviews",
    note: "These are sample reviews, not from real customers.",
    items: [
      { id: "amara", author: "Amara O.", score: 5, date: "2026-10-13", carType: "Economy", text: "Small, easy to park and cheap to run. Pick-up took a few minutes and the car was spotless." },
      { id: "luca", author: "Luca B.", score: 4.8, date: "2026-10-17", carType: "SUV", text: "Plenty of room for the family and our bags. It handled the mountain roads well and the return was simple." },
      { id: "mei", author: "Mei T.", score: 5, date: "2026-10-22", carType: "Compact", text: "A good size for city streets. Everything was clear from booking to drop-off." },
      { id: "sofia", author: "Sofia R.", score: 4.6, date: "2026-10-29", carType: "Van", text: "We fitted the whole group in with room to spare. Check the fuel rules before you leave, ours was full to full." },
      { id: "daniel", author: "Daniel K.", score: 4.9, date: "2026-11-02", carType: "Sedan", text: "Comfortable on a long drive and quiet on the motorway. No surprises at the desk." },
    ],
  },
  suppliers: {
    title: "Top brand services",
    note: "Suppliers and prices are samples.",
    items: carSuppliers.map((supplier) => supplier.name),
  },
  faqs: {
    title: "FAQs",
    items: [
      { id: "bring", question: "What do I need to bring to pick up the car?", answer: "Usually a valid driving license, a passport or ID, and a card in the main driver's name. Check your rental details, as this varies by supplier and country." },
      { id: "deposit", question: "Do I need to pay a deposit?", answer: "Most suppliers hold a deposit on a card at pick-up and release it after you return the car in good condition." },
      { id: "age", question: "Is there a minimum driver age?", answer: "This depends on the supplier and country. Drivers under 25 or over 69 may pay an extra fee." },
      { id: "fuel", question: "How does fuel work?", answer: "Many rentals are full to full, which means you collect the car with a full tank and return it full." },
      { id: "cancel", question: "Can I cancel my booking?", answer: "Cars marked as free cancellation can be cancelled for free until the time shown. Other rentals follow the supplier's rules." },
    ],
  },
  guide: {
    title: "Car rental guide",
    items: [
      {
        id: "why",
        title: "Why use Hotel Jr to book a rental car?",
        paragraphs: [
          "The right rental car depends on your destination, your group and your budget. Whether you are planning a family holiday, a weekend road trip or a few days in a city, you can compare your options here in one search.",
          "Cars, suppliers and prices on this site are samples for now, so no real rental is made when you book.",
        ],
        points: [
          { label: "Side-by-side results", text: "Compare car types, suppliers and totals on one page." },
          { label: "One-way rentals", text: "Pick up in one place and drop off in another." },
          { label: "Useful filters", text: "Narrow your list by car type, transmission, supplier or free cancellation." },
        ],
      },
      {
        id: "selection",
        title: "Hotel Jr's car rental selection",
        paragraphs: ["Choose the size of car that suits your trip, from small city cars to space for a whole group."],
        points: [
          { label: "Economy and compact", text: "Easy to park and well suited to city trips." },
          { label: "Sedan and SUV", text: "More comfort on long drives, with extra room for bags." },
          { label: "Van and luxury", text: "Seats for groups, or something special for the occasion." },
        ],
      },
      {
        id: "tips",
        title: "Car rental tips",
        paragraphs: ["A few small checks can make pick-up and return much easier."],
        points: [
          { label: "Check your documents", text: "Bring your driving license, ID and a card in the main driver's name." },
          { label: "Look over the car", text: "Take photos of any marks before you drive away." },
          { label: "Know the fuel rule", text: "On a full to full rental, refill before you return the car." },
        ],
      },
    ],
  },
  recommendations: {
    title: "Recommendation",
    items: [
      {
        id: "cities",
        label: "Popular cities",
        links: ["Dubai", "Cape Town", "Rome", "Bali", "Tokyo", "Marrakech"].map((city) => ({ label: `${city} car rental`, href: toLocationHref(city) })),
      },
      {
        id: "countries",
        label: "Popular countries",
        links: ["Italy", "Japan", "Morocco", "South Africa", "Indonesia"].map((country) => ({ label: `Car rental in ${country}`, href: toLocationHref(country) })),
      },
    ],
  },
};

export default carsContent;
