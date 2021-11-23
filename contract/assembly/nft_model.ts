import { env, PersistentVector, PersistentMap } from "near-sdk-as";
import { Metadata, metadatas } from "./metadata_model";
@nearBindgen
export class NFT {
  id: u64;
  owner: string;
  metadata: Metadata;

  constructor(id: u64, owner: string, metadata: Metadata) {
    this.id = id;
    this.owner = owner;
    this.metadata = metadata;
  }

}
// An array that stores meta data on the blockchain
export const nfts = new PersistentVector<NFT>("ntfs");