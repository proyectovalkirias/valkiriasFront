export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    image: string;
    categoryId: number;
}

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

export interface IUserOrder {
    id: number;
    status: string;
    date: Date;
    products: IProduct[]
}

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    // Aquí puedes agregar otras propiedades que el usuario tenga
  }