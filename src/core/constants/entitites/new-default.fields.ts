export interface INewDefaultFields {
  id?: string;
  archived?: boolean;
  metaData?: { [key: string]: any };
  dateDeleted?: Date;
  lastUpdated?: Date;
  dateCreated?: Date;
  deleted?: boolean;
}
