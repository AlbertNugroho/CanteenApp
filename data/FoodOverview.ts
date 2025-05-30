export type FoodOverview = {
  id: string;
  name: string;
  image: string;
  place: string;
  promo: boolean;
  totalBuyer: number;
};

export const foodOverviewData: FoodOverview[] = [
  {
    id: "1",
    name: "Bakmie Effata",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    place: "FOODPARK BINUS",
    promo: false,
    totalBuyer: 300,
  },
  {
    id: "2",
    name: "Ayam Geprek Binus",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    place: "FOODPARK BINUS",
    promo: false,
    totalBuyer: 250,
  },
  {
    id: "3",
    name: "SmackDown Burger",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    place: "BINUS UFC",
    promo: true,
    totalBuyer: 180,
  },
  {
    id: "4",
    name: "Triceps Tacos",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    place: "BINUS UFC",
    promo: true,
    totalBuyer: 200,
  },
  {
    id: "5",
    name: "Sate Ayam Nusantara",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    place: "FOODPARK BINUS",
    promo: false,
    totalBuyer: 150,
  },
  {
    id: "6",
    name: "Okky Fried Chicken",
    image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
    place: "FOODPARK BINUS",
    promo: false,
    totalBuyer: 210,
  },
];
