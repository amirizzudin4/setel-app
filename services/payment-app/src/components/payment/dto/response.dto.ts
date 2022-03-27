export enum ResponseStatus {
  fetch = 'FETCHED',
  create = 'CREATED',
  failed = 'FAILED',
  canceled = 'CANCELED',
  completed = 'COMPLETED'
}

export class ResponseDto {
  id?: string;
  status: ResponseStatus;
}
