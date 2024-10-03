export interface Car {
  _id: string;
  name: string;
  description: string;
  color: string;
  rating: number;
  model: string;
  year: string;
  category: string;
  status: "available" | "unavailable"; // assuming it's a limited set of statuses
  features: string[]; // array of features as strings
  images: string[]; // array of image URLs
  pricePerHour: number;
  isDeleted: boolean;
  createdAt: string; // could use Date type instead, depending on use case
  updatedAt: string; // could use Date type instead, depending on use case
  __v: number;
}
