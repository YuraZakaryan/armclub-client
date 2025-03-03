export interface FetchError {
  message: string;
  statusCode?: number;
  response?: {
    status: number;
    _data: {
      message: string;
    };
    data: {
      message: string;
    };
  };
}
