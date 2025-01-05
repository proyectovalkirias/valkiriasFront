export interface IUserSession {
    token: string;
    user: {
        id: number;
        email: string;
        name: string;
        address: string;
        phone: string;
        role: string;
        credential: {
            id: number;
            password: string;
        };
    };

}

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    // Aquí puedes agregar otras propiedades que el usuario tenga
  }

  export interface IUserOrder {
    id: string; // UUID en lugar de number
    status: string;
    date: string; // String porque las fechas suelen venir en ISO8601 desde el backend
    products: IOrderProduct[]; // Cambiado para reflejar los productos de una orden
  }
  
  export interface IOrderProduct {
    name: string;
description: string;
prices: []; 
size: []; 
color: []; 
category: string; 
photos: []; 
smallPrint: []; 
largePrint: []; 
stock: number 
  }
  
  export interface ICreateOrder {
    userId: string;
    products: {
      id: string;
      size: string;
    }[];
  }