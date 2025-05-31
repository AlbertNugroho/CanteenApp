export type OrderData = {
  id: number;
  data: menu[];
};

export type menu = {
  menuid: number;
  quantity: number;
};

export const OrderDatas: OrderData[] = [
  {
    id: 1,
    data: [
      { menuid: 3, quantity: 2 },
      { menuid: 4, quantity: 1 },
    ],
  },
  {
    id: 2,
    data: [{ menuid: 1, quantity: 5 }],
  },
  {
    id: 3,
    data: [
      { menuid: 2, quantity: 3 },
      { menuid: 4, quantity: 1 },
    ],
  },
  {
    id: 4,
    data: [
      { menuid: 1, quantity: 2 },
      { menuid: 3, quantity: 4 },
      { menuid: 4, quantity: 2 },
    ],
  },
  {
    id: 5,
    data: [{ menuid: 1, quantity: 3 }],
  },
  {
    id: 6,
    data: [
      { menuid: 1, quantity: 4 },
      { menuid: 3, quantity: 2 },
    ],
  },
];
