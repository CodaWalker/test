import { City, Route, Poi } from "@shared/schema";

export const mockCities: City[] = [
  {
    id: 1,
    name: "Barcelona",
    country: "Spain",
    mainImage: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=800&q=80",
    description: "Barcelona is a vibrant city known for its architecture, beaches, and culinary scene. The city offers a perfect blend of culture, history, and Mediterranean lifestyle.",
    additionalImages: [
      "https://images.unsplash.com/photo-1558102822-da570eb113ed?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1587789202069-f57c846b85db?auto=format&fit=crop&w=400&q=80"
    ],
    tags: ["Beach", "Architecture", "Food", "Nightlife", "Art", "Culture"],
    coordinates: { lat: 41.3851, lng: 2.1734 },
    localInfo: {
      weather: "28°C / 82°F",
      language: "Spanish, Catalan",
      currency: "Euro (€)",
      bestSeason: "Spring, Fall"
    }
  },
  {
    id: 2,
    name: "Rome",
    country: "Italy",
    mainImage: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=800&q=80",
    description: "Rome, Italy's capital, is a sprawling, cosmopolitan city with nearly 3,000 years of globally influential art, architecture and culture on display.",
    additionalImages: [
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1555992828-ca4dbe41d294?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1546946590-5d739af908e3?auto=format&fit=crop&w=400&q=80"
    ],
    tags: ["History", "Culture", "Food", "Architecture", "Art"],
    coordinates: { lat: 41.9028, lng: 12.4964 },
    localInfo: {
      weather: "26°C / 79°F",
      language: "Italian",
      currency: "Euro (€)",
      bestSeason: "Spring, Fall"
    }
  },
  {
    id: 3,
    name: "Paris",
    country: "France",
    mainImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
    description: "Paris, France's capital, is a major European city and a global center for art, fashion, gastronomy and culture. Its cityscape is defined by wide boulevards and the River Seine.",
    additionalImages: [
      "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1551887196-72e32bfc7bf3?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524396309943-e03f5249f002?auto=format&fit=crop&w=400&q=80"
    ],
    tags: ["Culture", "Art", "Food", "Fashion", "Architecture", "Romantic"],
    coordinates: { lat: 48.8566, lng: 2.3522 },
    localInfo: {
      weather: "22°C / 72°F",
      language: "French",
      currency: "Euro (€)",
      bestSeason: "Spring, Fall"
    }
  },
  {
    id: 4,
    name: "Santorini",
    country: "Greece",
    mainImage: "https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=800&q=80",
    description: "Santorini is a Greek island in the Aegean Sea known for its stunning white-washed buildings with blue domes, dramatic views, and spectacular sunsets.",
    additionalImages: [
      "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1530050805965-bf6fab9e00b7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1537936520548-d19b79f9b0e1?auto=format&fit=crop&w=400&q=80"
    ],
    tags: ["Beach", "Romantic", "Views", "Relaxation", "Culture"],
    coordinates: { lat: 36.3932, lng: 25.4615 },
    localInfo: {
      weather: "25°C / 77°F",
      language: "Greek",
      currency: "Euro (€)",
      bestSeason: "Late Spring, Summer, Early Fall"
    }
  },
  {
    id: 5,
    name: "Tokyo",
    country: "Japan",
    mainImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    description: "Tokyo, Japan's busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. It's known for its cutting-edge technology, fashion, and pop culture.",
    additionalImages: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1530031099377-f5f544402a74?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1570521462033-3015e76e7432?auto=format&fit=crop&w=400&q=80"
    ],
    tags: ["Culture", "Technology", "Food", "Shopping", "Urban"],
    coordinates: { lat: 35.6762, lng: 139.6503 },
    localInfo: {
      weather: "23°C / 73°F",
      language: "Japanese",
      currency: "Japanese Yen (¥)",
      bestSeason: "Spring, Fall"
    }
  },
  {
    id: 6,
    name: "New York",
    country: "USA",
    mainImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80",
    description: "New York City comprises 5 boroughs sitting where the Hudson River meets the Atlantic Ocean. It's known for its skyscrapers, Broadway theatres, and iconic landmarks including the Statue of Liberty.",
    additionalImages: [
      "https://images.unsplash.com/photo-1496588152823-86ff7695e68f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1543716091-a840c05249ec?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=400&q=80"
    ],
    tags: ["Urban", "Culture", "Food", "Shopping", "Nightlife", "Art"],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    localInfo: {
      weather: "21°C / 70°F",
      language: "English",
      currency: "US Dollar ($)",
      bestSeason: "Spring, Fall"
    }
  }
];

export const mockPois: Poi[] = [
  // Barcelona POIs
  {
    id: 1,
    cityId: 1,
    name: "Sagrada Familia",
    image: "https://images.unsplash.com/photo-1558102822-da570eb113ed?auto=format&fit=crop&w=400&q=80",
    description: "Gaudí's famous unfinished basilica, known for its intricate facades and towering spires.",
    tags: ["Architecture", "Culture", "Art"]
  },
  {
    id: 2,
    cityId: 1,
    name: "Park Güell",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=400&q=80",
    description: "Colorful park with amazing buildings, sculptures, and tile work designed by Gaudí.",
    tags: ["Architecture", "Art", "Outdoors"]
  },
  {
    id: 3,
    cityId: 1,
    name: "Gothic Quarter",
    image: "https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=400&q=80",
    description: "The historic center of old Barcelona, with medieval buildings and narrow winding streets.",
    tags: ["History", "Culture", "Architecture"]
  },
  {
    id: 4,
    cityId: 1,
    name: "La Rambla",
    image: "https://images.unsplash.com/photo-1587789202069-f57c846b85db?auto=format&fit=crop&w=400&q=80",
    description: "A popular tree-lined pedestrian street in central Barcelona, filled with shops and cafes.",
    tags: ["Shopping", "Food", "Culture"]
  },
  
  // Rome POIs
  {
    id: 5,
    cityId: 2,
    name: "Colosseum",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80",
    description: "Ancient amphitheater where gladiators once battled, a symbol of Imperial Rome.",
    tags: ["History", "Architecture", "Culture"]
  },
  {
    id: 6,
    cityId: 2,
    name: "Vatican City",
    image: "https://images.unsplash.com/photo-1555992828-ca4dbe41d294?auto=format&fit=crop&w=400&q=80",
    description: "Home to St. Peter's Basilica and the Vatican Museums, including the Sistine Chapel.",
    tags: ["Art", "History", "Culture", "Architecture"]
  },
  {
    id: 7,
    cityId: 2,
    name: "Trevi Fountain",
    image: "https://images.unsplash.com/photo-1529154036614-a60975f5c760?auto=format&fit=crop&w=400&q=80",
    description: "Iconic 18th-century fountain known for the tradition of throwing coins to ensure a return to Rome.",
    tags: ["Culture", "Art", "Architecture"]
  },
  {
    id: 8,
    cityId: 2,
    name: "Roman Forum",
    image: "https://images.unsplash.com/photo-1546946590-5d739af908e3?auto=format&fit=crop&w=400&q=80",
    description: "Ancient ruins of government buildings that were once the center of day-to-day life in Rome.",
    tags: ["History", "Architecture", "Culture"]
  },
  
  // Paris POIs
  {
    id: 9,
    cityId: 3,
    name: "Eiffel Tower",
    image: "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=400&q=80",
    description: "Iconic 19th-century tower that's become the ultimate symbol of Paris.",
    tags: ["Architecture", "Romantic", "Views"]
  },
  {
    id: 10,
    cityId: 3,
    name: "Louvre Museum",
    image: "https://images.unsplash.com/photo-1551887196-72e32bfc7bf3?auto=format&fit=crop&w=400&q=80",
    description: "World's largest art museum, home to thousands of works including the Mona Lisa.",
    tags: ["Art", "Culture", "History"]
  },
  {
    id: 11,
    cityId: 3,
    name: "Notre-Dame Cathedral",
    image: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?auto=format&fit=crop&w=400&q=80",
    description: "Medieval Catholic cathedral known for its French Gothic architecture.",
    tags: ["Architecture", "History", "Culture"]
  },
  {
    id: 12,
    cityId: 3,
    name: "Montmartre",
    image: "https://images.unsplash.com/photo-1524396309943-e03f5249f002?auto=format&fit=crop&w=400&q=80",
    description: "Hilltop district famous for its artistic history and the white-domed Sacré-Cœur Basilica.",
    tags: ["Art", "Culture", "Views"]
  },
];

export const mockRoutes: Route[] = [
  {
    id: 1,
    name: "Mediterranean Tour",
    cities: [1, 2],
    startDate: new Date("2023-08-15T00:00:00Z"),
    endDate: new Date("2023-08-22T00:00:00Z"),
    price: 1200,
    color: "#FF385C"
  },
  {
    id: 2,
    name: "Spanish Discovery",
    cities: [1, 4],
    startDate: new Date("2023-09-03T00:00:00Z"),
    endDate: new Date("2023-09-10T00:00:00Z"),
    price: 950,
    color: "#00A699"
  },
  {
    id: 3,
    name: "European Highlights",
    cities: [3, 1, 2],
    startDate: new Date("2023-10-05T00:00:00Z"),
    endDate: new Date("2023-10-15T00:00:00Z"),
    price: 1800,
    color: "#FFB400"
  },
  {
    id: 4,
    name: "Cultural Journey",
    cities: [2, 3],
    startDate: new Date("2023-09-15T00:00:00Z"),
    endDate: new Date("2023-09-25T00:00:00Z"),
    price: 1500,
    color: "#8B5CF6"
  },
  {
    id: 5,
    name: "Island Hopping",
    cities: [4, 5],
    startDate: new Date("2023-07-10T00:00:00Z"),
    endDate: new Date("2023-07-20T00:00:00Z"),
    price: 2200,
    color: "#10B981"
  },
  {
    id: 6,
    name: "Urban Adventure",
    cities: [6, 5],
    startDate: new Date("2023-09-08T00:00:00Z"),
    endDate: new Date("2023-09-18T00:00:00Z"),
    price: 2500,
    color: "#3B82F6"
  },
  {
    id: 7,
    name: "Global Capitals",
    cities: [3, 6],
    startDate: new Date("2023-08-22T00:00:00Z"),
    endDate: new Date("2023-09-01T00:00:00Z"),
    price: 2300,
    color: "#EC4899"
  }
];
