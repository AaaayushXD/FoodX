declare namespace API {
  interface ApiResponse {
    data: string | string[] | object | any;
    message: string;
    success: boolean;
    status: number;
    errors?: any;
  }
}
