class ApiError<T> extends Error {
 public statusCode: number;
 public error?: T;
 public data?: any;
 public success: boolean;

 constructor(
   statusCode: number,
   message?: string,
   error?: T,
   data: any = null,
   success: boolean = false
 ) {
   super(message);
   this.statusCode = statusCode > 399 ? statusCode : 400;
   this.error = error;
   this.message = message || "Something went wrong";
   this.data = data;
   this.success = success;
 }
}

export { ApiError };