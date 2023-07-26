export interface Pagination<T> {
  content: T[];
  numberOfElements: number;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface RequestApi<T = any> {
  data: T;
  code: number;
  isSuccess: boolean;
  message: string;
  totalTime: number;
}

export interface QueryFilter<T = any> {
  page?: number;
  size?: number;
  filter?: T;
  sort?: string;
  id?: string;
}
