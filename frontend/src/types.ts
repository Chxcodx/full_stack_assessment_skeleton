export type Nullable<T> = T | null;

export interface HomeType {
  id: number;
  street_address: string;
  state: string;
  zip: string;
  sqft: number;
  beds: number;
  baths: number;
  list_price: number;
  users: UserType[];
}

export interface UserType {
  id: number;
  username: string;
  email: string;
  homes: HomeType[];
}
