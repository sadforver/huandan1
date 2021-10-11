
export interface Result<T> {
    code: number;
    message: string;
    data: T;
    count: number;
  }
  export interface checkres {
    code: number;
    message: string;
    count: number;
  }