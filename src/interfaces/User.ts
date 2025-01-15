export interface Address {
  id: string;
  street: string;
  number: number;
  city: string;
  state: string;
  postalCode: string;
  longitude?: number;
  latitude?: number;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  address: Address[];
  phone: string;
  active: boolean;
  isAdmin: boolean;
}

// {
//   "firstname": "Valkirias",
//   "lastname": "Valkirias",
//   "password": "Valkirias123",
//   "dni": 0,
//   "phone": "string",
//   "addresses": [
//     {
//       "street": "Beruti",
//       "number": 416,
//       "city": "Tigre",
//       "state": "Buenos Aires",
//       "postalCode": "1648"
//     }
//   ],
//   "photo": "string"
// }
