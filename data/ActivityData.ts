import { FoodOverview } from "./FoodOverview";
import { foodOverviewData } from "./FoodOverview";

export type FoodOrderData = {
  id: string;
  food: FoodOverview;
  ongoing?: boolean;
  pickupTime: string; // <-- added
};

export const foodOrderData: FoodOrderData[] = [
  {
    id: "order1",
    food: foodOverviewData[0],
    ongoing: true,
    pickupTime: "07:00",
  },
  {
    id: "order2",
    food: foodOverviewData[1],
    ongoing: false,
    pickupTime: "09:00",
  },
  {
    id: "order3",
    food: foodOverviewData[2],
    ongoing: false,
    pickupTime: "11:00",
  },
  {
    id: "order4",
    food: foodOverviewData[3],
    ongoing: false,
    pickupTime: "13:00",
  },
  {
    id: "order5",
    food: foodOverviewData[4],
    ongoing: false,
    pickupTime: "15:00",
  },
  {
    id: "order6",
    food: foodOverviewData[5],
    ongoing: false,
    pickupTime: "17:00",
  },
  {
    id: "order7",
    food: foodOverviewData[2],
    ongoing: false,
    pickupTime: "07:00",
  },
  {
    id: "order8",
    food: foodOverviewData[0],
    ongoing: false,
    pickupTime: "09:00",
  },
  {
    id: "order9",
    food: foodOverviewData[1],
    ongoing: true,
    pickupTime: "11:00",
  },
  {
    id: "order10",
    food: foodOverviewData[3],
    ongoing: false,
    pickupTime: "13:00",
  },
];
