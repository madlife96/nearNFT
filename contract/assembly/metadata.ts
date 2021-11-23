import { env, PersistentVector, PersistentMap } from "near-sdk-as";
@nearBindgen
export class Metadata {
  id: i32;
  title: string;
  description: string;
  media: string;
  copies: i32;

  constructor(id: i32, title: string, description: string, media: string, copies: i32) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.media = media;
    this.copies = copies;
  }

}// An array that stores products on the blockchain
//export const metadatas = new PersistentVector<Metadata>("mtds");