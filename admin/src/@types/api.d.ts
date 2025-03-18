declare namespace Api {
  interface Response<T> {
    success: boolean;
    data: T;
    message: string;
    status: number;
  }

  interface ApiError {
    code: number;
    name?: string;
    response: Response<Response<any>>;
  }

  interface FetchPaginate<T, K = Common.OrderStatus, L = undefined> {
    pageSize: number;
    path?: L;
    filter?: T;
    sort?: "asc" | "desc";
    currentFirstDoc?: any | null;
    currentLastDoc?: any | null;
    direction?: "prev" | "next";
    status?: K;
    uid?: string
  }

  interface FetchNotification extends FetchPaginate<keyof Model.Notification> {
    uid?: string;
  }

  interface GetRevenue{
    startDate: string
    endDate?: string
  }

  interface PaginateResponse<T> {
    data: T;
    length: number;
    currentFirstDoc: string;
    currentLastDoc: string;
  }
}
