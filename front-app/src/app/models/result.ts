export interface Result<T> {
    count?: number;
    code: number;
    message: string;
    data: T;
  }
  
  export interface Page<T> {
    count: number;
    next: any;
    previous: any;
    results: T;
  }
  
  export interface Data<T> {
    total: number;
    list: T;
  }
  