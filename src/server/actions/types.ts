export type ServerActionResponse<T = void> = (T extends void | undefined ? {
  success: true;
  data?: never;
  errorMessage?: never;
} : {
  success: true;
  data: T;
  errorMessage?: never;
}) | {
  success: false;
  data?: never;
  errorMessage: string
}
