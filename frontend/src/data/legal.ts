import type { LegalDocument, LegalSlug } from "@/types";

// Draft wording for a lawyer to review. Text in [square brackets] must be replaced before launch.
const legalDocuments: Record<LegalSlug, LegalDocument> = {
  terms: {
    slug: "terms",
    title: "Booking terms",
    summary: "The rules that apply when you use Hotel Jr and book a stay, flight or activity.",
    updatedOn: "November 4, 2026",
    isDraft: true,
    sections: [
      {
        id: "about",
        title: "About these terms",
        paragraphs: [
          "Hotel Jr is operated by [Company legal name], registered in [Country] at [Registered address]. In these terms, \"we\" means [Company legal name] and \"you\" means the person using the site.",
          "By using the site or making a booking, you agree to these terms. If you book for other people, you confirm that you have their permission and that they accept these terms too.",
        ],
      },
      {
        id: "our-role",
        title: "Our role",
        paragraphs: [
          "We help you find and book travel services provided by others, such as hotels, airlines and activity operators. The provider of each service is responsible for delivering it, and its own conditions also apply to your booking.",
        ],
      },
      {
        id: "booking",
        title: "Making a booking",
        paragraphs: ["A booking is only confirmed when you receive a booking reference from us."],
        items: [
          "You must be at least 18 years old to make a booking.",
          "The details you give must be accurate. Names on flight bookings must match each traveler's passport.",
          "Prices and availability can change until your booking is confirmed.",
        ],
      },
      {
        id: "prices",
        title: "Prices and payment",
        paragraphs: [
          "Prices are shown in the currency displayed at checkout and include the taxes and fees we are told about, unless we say otherwise. Hotels may charge local taxes or deposits at the property.",
          "Each booking shows how and when you pay. Some hotel bookings are paid at the property.",
        ],
      },
      {
        id: "changes",
        title: "Changes and cancellations",
        paragraphs: [
          "The cancellation rules for your booking are shown before you confirm it. Where a booking is marked as free cancellation, you can cancel for free until the time stated. Non-refundable bookings cannot be refunded unless the law requires it.",
          "If a provider changes or cancels your booking, we will tell you as soon as we can and help you with your options.",
        ],
      },
      {
        id: "your-trip",
        title: "Your responsibilities when traveling",
        paragraphs: ["You are responsible for having everything you need for your trip."],
        items: [
          "Valid passports, visas and any required vaccinations.",
          "Arriving on time for check-in, departures and activities.",
          "Following the rules of the hotel, airline or activity operator.",
        ],
      },
      {
        id: "liability",
        title: "Our responsibility to you",
        paragraphs: [
          "We take care to show accurate information, but much of it comes from providers. Nothing in these terms limits any rights you have by law that cannot be limited. [Liability wording to be added by your lawyer.]",
        ],
      },
      {
        id: "law",
        title: "Governing law and contact",
        paragraphs: [
          "These terms are governed by the laws of [Country]. If you have a problem with a booking, contact us at [Support email] and we will try to put it right.",
          "We may update these terms. The version that applies is the one shown when you made your booking.",
        ],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy statement",
    summary: "What personal information we collect, why we use it and the choices you have.",
    updatedOn: "November 4, 2026",
    isDraft: true,
    sections: [
      {
        id: "who",
        title: "Who we are",
        paragraphs: [
          "Hotel Jr is operated by [Company legal name], [Registered address]. We are responsible for your personal information. You can contact us about privacy at [Privacy email].",
        ],
      },
      {
        id: "collect",
        title: "Information we collect",
        paragraphs: ["We collect the information you give us when you use the site."],
        items: [
          "Account details: your name, email address and password.",
          "Booking details: names, email, phone number, travel dates, and any arrival time or special requests.",
          "Flight bookings: the name and date of birth of each traveler, including children.",
          "Car rentals: the main driver's name and date of birth, to check the driver's age.",
          "Searches you make, such as destinations and dates.",
        ],
      },
      {
        id: "use",
        title: "How we use your information",
        paragraphs: ["We use your information only for these purposes."],
        items: [
          "To make and manage your bookings.",
          "To sign you in and keep your account secure.",
          "To contact you about your trip and answer your questions.",
          "To meet our legal obligations.",
        ],
      },
      {
        id: "sharing",
        title: "Who we share it with",
        paragraphs: [
          "We share your booking details with the hotel, airline or activity operator providing your service, because they need them to deliver it. We also use service providers that help us run the site: [List of hosting, email and payment providers].",
          "We do not sell your personal information.",
        ],
      },
      {
        id: "payments",
        title: "Payments",
        paragraphs: [
          "We do not store card numbers. When online payment is added, card details will be handled directly by [Payment provider].",
        ],
      },
      {
        id: "cookies",
        title: "Cookies and third-party content",
        paragraphs: [
          "We use one essential cookie named \"session\" to keep you signed in. It lasts for 7 days and cannot be read by scripts on the page.",
          "Photos on the site load directly from Unsplash, so Unsplash receives your IP address and basic browser information when you view them. We do not currently use advertising or analytics cookies.",
        ],
      },
      {
        id: "retention",
        title: "How long we keep it",
        paragraphs: [
          "We keep booking records for [Retention period] to meet accounting and legal requirements. Account details are kept until you ask us to delete your account.",
        ],
      },
      {
        id: "rights",
        title: "Your rights",
        paragraphs: ["Depending on where you live, you may have the right to:"],
        items: [
          "See the personal information we hold about you.",
          "Correct information that is wrong.",
          "Ask us to delete your information.",
          "Object to how we use it, or complain to your data protection authority.",
        ],
      },
      {
        id: "changes",
        title: "Changes to this statement",
        paragraphs: ["We may update this statement. We will change the date at the top when we do."],
      },
    ],
  },
};

export default legalDocuments;
