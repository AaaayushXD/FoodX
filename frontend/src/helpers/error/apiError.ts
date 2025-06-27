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

export function handleApiError(error: any): ApiError<any> {
  if (typeof error === "object" && error !== null) {
    return new ApiError(
      error?.statusCode || 400,
      error?.message || "Something went wrong",
      error?.error || "Unknown Error", // Properly setting error message
      error?.data || null,
      error?.success ?? false
    );
  }

  return new ApiError(500, "Something went wrong", "Unknown Error");
}
