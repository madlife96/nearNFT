import { env, PersistentVector, PersistentMap } from "near-sdk-as";
@nearBindgen
export class Metadata {
  id: i32;
  title: string;
  description: string;
  media: string;

  constructor(id: i32, title: string, description: string, media: string) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.media = media;
  }

}
// An array that stores meta data on the blockchain
export const metadatas = new PersistentVector<Metadata>("mtds");


