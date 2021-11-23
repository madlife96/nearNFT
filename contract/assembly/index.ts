import { Context, logging, storage } from 'near-sdk-as'
import { Metadata, metadatas } from './metadata_model';
import { mint_to, get_token_owner, get_meta_data, grant_access,
   check_access, transfer, transfer_from, revoke_access } from './nft';
import { NFT, nfts } from './nft_model';

const INIT_ID = 0;

export function mintNewNFT(receiver: string, title: string, description: string, media: string): bool {
  let owner = Context.sender;
  let id = metadatas.length + 1;
  let metadata = new Metadata(id, title, description, media);
  let index = metadatas.push(metadata);

  let minted_nft_id = mint_to(receiver, metadata);

  let tokenOwner = get_token_owner(minted_nft_id);

  if(tokenOwner == receiver) {
    return true;
  }
  else {
    return false;
  }
}

export function transferNFT(receiver: string, tokenId: u64): bool {
  //transfer nft to new owner
  transfer(receiver, tokenId);

  let check_new_owner = get_token_owner(tokenId);

  if(check_new_owner == receiver) {
    return true;
  }
  else {
    return false;
  }
}

export function getNFTOwner(tokenId: u64): string {
  return get_token_owner(tokenId);
}

export function getNFTMetaData(tokenId: u64): Metadata {
  return get_meta_data(tokenId);
}

export function getAllNFTsByOwner(accountId: string): NFT[] {
  let results = new Array<NFT>();

  for(let i = 0; i < nfts.length; i++) {
    let nft_owner = nfts[i].owner;
    if(nft_owner == accountId) {
      results.push(nfts[i]);
    }
  }
  return results;
}
