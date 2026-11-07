import unsplashImage from "./unsplashImage";

// Shown on the home and flights pages.
const appPromo = {
  title: "A Hotel Jr app is planned",
  imageUrl: unsplashImage("photo-1573843981267-be1999ff37cd", 2000),
  benefits: ["All your trips", "Trip updates", "Travel assistant"],
  ctaLabel: "See what's planned",
  ctaHref: "/app",
};

export default appPromo;
