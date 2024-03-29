export enum ResponseStatus {
  fetch = 'FETCHED',
  create = 'CREATED',
  failed = 'FAILED',
  canceled = 'CANCELED'
}

export class ResponseDto {
  id?: string;
  status: ResponseStatus;
}
