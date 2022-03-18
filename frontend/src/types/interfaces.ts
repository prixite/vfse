export interface ApiError {
  status: number;
  data: Record<string, Array<string>>;
}
