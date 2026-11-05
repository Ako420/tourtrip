import type { Guide } from "@/types";
import unsplashImage from "./unsplashImage";

type GuideInput = [slug: string, city: string, title: string, photoId: string, publishedAt: string, body: string];

const rows: GuideInput[] = [
  [
    "tokyo",
    "Tokyo",
    "Tokyo travel guide: neighbourhoods, food and trains",
    "photo-1540959733332-eab4deabeeaf",
    "2026-10-28",
    `Tokyo is less one city than a collection of neighbourhoods, each with its own pace. Pick two or three areas a day and you will see far more than if you try to cross the whole map.

## Where to start

Shibuya and Shinjuku are the bright, busy heart of the city. Asakusa keeps an older feel around its temple streets, while Ueno mixes museums with a big park.

## Eating well

Some of the best meals are the simplest. Try a small ramen counter, a train station bento or a late bowl of noodles after an evening out.

## Getting around

Trains and subways reach almost everywhere. A rechargeable transit card saves buying a ticket for each trip, and it is worth avoiding the morning rush.`,
  ],
  [
    "bali",
    "Bali",
    "Bali travel guide: temples, rice terraces and beaches",
    "photo-1537996194471-e657df975ab4",
    "2026-10-22",
    `Bali suits slow travel. The south has the surf and the sunsets, the centre has green hills and craft villages, and the lakes in the north feel cool and quiet.

## Where to stay

Ubud is a good base for culture and rice terraces. The southern coast is better for beaches, cafes and an easy trip from the airport.

## Visiting temples

Temples are active places of worship, so cover your shoulders and knees. A sarong is often required, and you can usually borrow one at the entrance.

## When to go

The drier months run from about April to October. Rain in the wet season often comes in short bursts, so it rarely stops a day out.`,
  ],
  [
    "paris",
    "Paris",
    "Paris travel guide: landmarks, cafes and walks",
    "photo-1511739001486-6bfe10ce785f",
    "2026-10-15",
    `Paris rewards walking. The big sights are close enough to link on foot, and the streets between them are often the best part of the day.

## The classics

Book the Eiffel Tower and the major museums ahead when you can, because popular times sell out. Early mornings are usually calmer.

## Slower days

Spend an afternoon along the Seine, wander through the Marais or find a cafe table and watch the city go by.

## Getting around

The metro is quick and frequent. Most central trips take under half an hour, so it is easy to mix walking with a few stops underground.`,
  ],
  [
    "rome",
    "Rome",
    "Rome travel guide: ancient sites and easy evenings",
    "photo-1552832230-c0197dd311b5",
    "2026-10-09",
    `Rome layers thousands of years of history into a single walk. You can pass ancient ruins, baroque fountains and neighbourhood markets in the space of an hour.

## Ancient Rome

Give the Colosseum, the Forum and the Palatine Hill a full morning. They sit side by side, and comfortable shoes make a real difference.

## Evenings out

Trastevere is a favourite for dinner, with narrow streets and busy small restaurants. Many Romans eat late, so there is no need to rush.

## Practical tips

Cover shoulders and knees for churches. Carry a refillable bottle too, as the city's public drinking fountains are a useful help in summer.`,
  ],
  [
    "marrakech",
    "Marrakech",
    "Marrakech travel guide: souks, gardens and riads",
    "photo-1597212618440-806262de4f6b",
    "2026-10-02",
    `Marrakech is colourful, loud and full of small surprises. Its old walled medina is the place to get lost for a while, then retreat to a calm courtyard.

## The medina

The souks spread out from the main square, grouped loosely by trade. Getting lost is part of the visit, so leave extra time for walking back.

## Where to stay

A riad is a traditional house built around a courtyard. Many are now small guesthouses, and staying in one feels very different from a large hotel.

## Staying comfortable

Spring and autumn are the most comfortable seasons. Summers are very hot, so plan walks for the morning and the evening.`,
  ],
  [
    "cape-town",
    "Cape Town",
    "Cape Town travel guide: mountains, coast and wine",
    "photo-1580060839134-75a5edca2e99",
    "2026-09-25",
    `Cape Town sits between a dramatic mountain and two very different stretches of ocean. Few cities make it so easy to mix outdoor days with good food.

## Table Mountain

Take the cableway or hike up on a clear day. The weather changes quickly at the top, so check conditions first and bring a layer.

## Along the coast

A drive around the peninsula passes beaches, fishing harbours and sea views. Boulders Beach is known for its colony of African penguins.

## Beyond the city

The winelands are an easy day trip, with historic towns and mountain scenery. Book a driver or a tour if you plan on tasting.`,
  ],
  [
    "cappadocia",
    "Cappadocia",
    "Cappadocia travel guide: balloons and rock valleys",
    "photo-1641128324972-af3212f0f6bd",
    "2026-09-18",
    `Cappadocia is a landscape of soft rock shaped by wind and time, with valleys of stone pillars and old homes and churches carved into the hills.

## Balloon flights

Flights leave around sunrise and depend on the weather. Allow a spare morning in your trip in case a flight is cancelled.

## Exploring the valleys

Many of the valleys are good for walking, and the views change quickly as the light moves. Underground cities nearby show how people once lived below the surface.

## Where to stay

Several hotels here are built into the rock. They make a memorable base, and many have terraces for watching the balloons rise.`,
  ],
  [
    "nairobi",
    "Nairobi",
    "Nairobi travel guide: safari days from a capital city",
    "photo-1516426122078-c23e76319801",
    "2026-09-11",
    `Nairobi is one of very few capital cities with a national park at its edge. You can watch wildlife in the morning and be back in the city for dinner.

## Nairobi National Park

Early morning game drives give you the best chance of seeing animals. The city skyline behind the grasslands makes the park feel unlike anywhere else.

## Going further

Nairobi is also the usual starting point for longer safaris in Kenya. Your driver and guide can make a big difference, so read about them before you book.

## What to pack

Bring layers, because mornings can be cool. Neutral colours, sun protection and a good pair of binoculars are all useful on a game drive.`,
  ],
  [
    "tromso",
    "Tromso",
    "Tromso travel guide: chasing the northern lights",
    "photo-1531366936337-7c912a4589a7",
    "2026-09-04",
    `Tromso lies far above the Arctic Circle, which makes it one of the best known places to look for the northern lights in Norway.

## Seeing the lights

The aurora season runs through the dark months, roughly September to March. Sightings depend on clear skies and solar activity, so no night is guaranteed.

## Improving your chances

Stay for several nights and go out of town, away from the lights. Guided tours can drive to wherever the weather looks clearest.

## Keeping warm

Winter days are short and cold. Wear thermal layers, warm boots and a hat, and expect to stand outside for long stretches at night.`,
  ],
  [
    "the-alps",
    "The Alps",
    "The Alps travel guide: lakes, trails and mountain towns",
    "photo-1476514525535-07fb3b4ae5f1",
    "2026-08-28",
    `The Alps stretch across several European countries, with clear lakes below and high peaks above. Every season offers something different.

## Summer

Warm months are ideal for walking, swimming and boat trips. Cable cars lift you high above the valleys without a hard climb.

## Winter

Snow turns the mountain towns into ski resorts. Even if you do not ski, winter walks and quiet lakeside villages are worth the trip.

## Planning your route

Trains link many of the valleys, and the journeys are scenic. Mountain weather can change quickly, so check the forecast before a long hike.`,
  ],
  [
    "cairo",
    "Cairo",
    "Cairo travel guide: the pyramids and beyond",
    "photo-1553913861-c0fddf2619ee",
    "2026-08-21",
    `Cairo is huge, busy and full of history. The Pyramids of Giza are the headline, but the city has thousands of years of stories to explore.

## The pyramids

Arrive early to avoid the strongest heat and the largest crowds. The Sphinx stands nearby, and a guide can bring the site's history to life.

## Old Cairo

Spend time among the historic mosques, churches and markets of the older city. The great bazaar is a lively place to wander and shop.

## When to go

The cooler months from about October to April are the most comfortable. Summer is very hot, so plan outdoor sites for early in the day.`,
  ],
  [
    "santorini",
    "Santorini",
    "Santorini travel guide: white villages and sunsets",
    "photo-1570077188670-e3a8d69ac5ff",
    "2026-08-14",
    `Santorini is a Greek island shaped by a volcano. Its white villages sit high on the cliffs, looking down over a deep blue caldera.

## Villages and views

Oia is famous for its sunsets, so arrive early for a good spot. Fira is the island's busy main town, and a cliffside path links the two.

## Beaches

The beaches here are unusual, with dark sand and pebbles formed by volcanic rock. Bring sandals, as the sand gets very hot.

## Island hopping

Ferries connect Santorini with other Greek islands and with Athens. Spring and early autumn are quieter, and still warm enough for the sea.`,
  ],
];

// Same shape as GET /guides and GET /guides/:slug. Used until API_URL is set.
const guides: Guide[] = rows.map(([slug, city, title, photoId, publishedAt, body], index) => ({
  id: String(index + 1),
  slug,
  city,
  title,
  body,
  coverUrl: unsplashImage(photoId, 1600),
  publishedAt,
}));

export default guides;
