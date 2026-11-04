const unsplashImage = (photoId: string, width = 800) => {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=75`;
};

export default unsplashImage;
