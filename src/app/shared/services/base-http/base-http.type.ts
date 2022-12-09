export interface HttpResponse<R> {
  isSuccess: boolean;
  type: string;
  data: R;
}

export interface QueryParams {
  [key: string]: any;
}
