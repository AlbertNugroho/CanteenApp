export type MenuItem = {
  name: string;
  price: number;
  image: string;
  description: string;
  bought: number;
  availability: boolean;
};

export type FoodDetail = {
  id: string;
  menus: MenuItem[];
};

export const foodDetailData: FoodDetail[] = [
  {
    id: "1",
    menus: [
      {
        name: "Bakmie Spesial",
        price: 20000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Bakmie dengan topping ayam dan pangsit goreng",
        bought: 53,
        availability: true,
      },
      {
        name: "Bakmie Pedas",
        price: 22000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Bakmie dengan sambal spesial pedas",
        bought: 19,
        availability: false,
      },
      {
        name: "Bakmie Jamur",
        price: 21000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Bakmie dengan topping jamur dan sawi",
        bought: 31,
        availability: true,
      },
      {
        name: "Bakmie Bakso",
        price: 23000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Bakmie dengan bakso sapi dan kuah gurih",
        bought: 46,
        availability: true,
      },
    ],
  },
  {
    id: "2",
    menus: [
      {
        name: "Ayam Geprek Level 1",
        price: 18000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Ayam geprek dengan sambal level 1",
        bought: 67,
        availability: true,
      },
      {
        name: "Ayam Geprek Keju",
        price: 21000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Ayam geprek dengan topping keju leleh",
        bought: 12,
        availability: true,
      },
      {
        name: "Ayam Geprek Mozarella",
        price: 25000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Ayam geprek dengan mozarella leleh",
        bought: 39,
        availability: true,
      },
      {
        name: "Ayam Geprek Sambal Matah",
        price: 22000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Ayam geprek dengan sambal matah khas Bali",
        bought: 27,
        availability: false,
      },
    ],
  },
  {
    id: "3",
    menus: [
      {
        name: "Cheese Burger",
        price: 25000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Burger daging sapi dengan keju leleh",
        bought: 42,
        availability: false,
      },
      {
        name: "Double Beef Burger",
        price: 30000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Burger dengan dua lapis daging dan keju",
        bought: 77,
        availability: true,
      },
      {
        name: "Chicken Burger",
        price: 23000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Burger ayam renyah dengan selada dan mayo",
        bought: 34,
        availability: true,
      },
      {
        name: "BBQ Burger",
        price: 28000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Burger sapi dengan saus BBQ dan bawang karamel",
        bought: 18,
        availability: true,
      },
    ],
  },
  {
    id: "4",
    menus: [
      {
        name: "Beef Tacos",
        price: 23000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Taco daging sapi dengan saus tomat segar",
        bought: 5,
        availability: false,
      },
      {
        name: "Spicy Chicken Tacos",
        price: 24000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Taco ayam pedas dengan salsa",
        bought: 64,
        availability: true,
      },
      {
        name: "Fish Tacos",
        price: 26000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Taco ikan goreng tepung dengan saus tartar",
        bought: 29,
        availability: true,
      },
      {
        name: "Taco Veggie",
        price: 22000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Taco sayuran segar dengan saus guacamole",
        bought: 11,
        availability: true,
      },
    ],
  },
  {
    id: "5",
    menus: [
      {
        name: "Sate Ayam Bumbu Kacang",
        price: 22000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Sate ayam disajikan dengan bumbu kacang khas",
        bought: 33,
        availability: true,
      },
      {
        name: "Sate Ayam Pedas",
        price: 23000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Sate ayam dengan sambal ekstra pedas",
        bought: 9,
        availability: false,
      },
      {
        name: "Sate Kambing",
        price: 27000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Sate kambing dengan kecap dan bawang goreng",
        bought: 22,
        availability: true,
      },
      {
        name: "Sate Lilit Bali",
        price: 25000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Sate khas Bali dengan bumbu rempah",
        bought: 14,
        availability: true,
      },
    ],
  },
  {
    id: "6",
    menus: [
      {
        name: "Original Fried Chicken",
        price: 20000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Ayam goreng crispy original",
        bought: 84,
        availability: true,
      },
      {
        name: "Spicy Fried Chicken",
        price: 22000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Ayam goreng pedas dengan bumbu spesial",
        bought: 21,
        availability: false,
      },
      {
        name: "Honey Garlic Chicken",
        price: 24000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Ayam goreng dengan saus madu bawang putih",
        bought: 35,
        availability: true,
      },
      {
        name: "Korean Spicy Chicken",
        price: 26000,
        image: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg",
        description: "Ayam goreng Korea dengan saus gochujang pedas",
        bought: 45,
        availability: true,
      },
    ],
  },
];
