export interface S3Interface {
  bucket: string;
  key: string;
  location: string;
}

export interface RouteParam {
  id?: string;
  folderId?: string;
  docId?: string;
}
