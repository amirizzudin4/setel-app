export enum ResponseStatus {
  fetch = 'FETCHED',
  create = 'CREATED',
  failed = 'FAILED',
  deleted = 'DELETED'
}

export class ResponseDto {
  status: ResponseStatus;
}
