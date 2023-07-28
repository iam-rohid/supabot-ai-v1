export type MenuItem = {
  href: string;
  label: string;
  exactMatch?: boolean;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
};
export type ApiSuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ApiResponse<T = undefined> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse;
