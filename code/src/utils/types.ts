export interface ScheduleRow {
  id: number;
  user_id: number;
  name: string;
  address: string;
  contact: string;
  cuisine: string;
  hours: string;
  availableTimes: string;
  tableSize: string;
  description: string;
  photos: string;
  lat: number;
  lng: number;
  status: string;
  createdAt: string;
  updateAt: string;
  phone: string;
  website: string;
  menu: string;
  bookings?: any[];
}

export interface ScheduleRowImp {
  id: number;
  user_id: number;
  name: string;
  address: {
    place_id: string;
    formatted_address: string;
    lat: number;
    lng: number;
    street_number: string;
    city: string;
    county: string;
    state_long: string;
    state: string;
    country_long: string;
    country: string;
    postal_code: string;
    postal_code_suffix: string;
  };
  contact: string;
  cuisine: string;
  hours: any[];
  availableTimes: any[];
  tableSize: any[];
  description: string;
  photos: any[];
  lat: number;
  lng: number;
  status: string;
  createdAt: string;
  updateAt: string;
  phone: string;
  website: string;
  menu: any[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const cleanRow = (row: ScheduleRow) => {
  row.address = JSON.parse(row.address);
  row.hours = JSON.parse(row.hours);
  row.availableTimes = JSON.parse(row.availableTimes);
  row.tableSize = JSON.parse(row.tableSize);
  row.photos = JSON.parse(row.photos);

  return row;
};
