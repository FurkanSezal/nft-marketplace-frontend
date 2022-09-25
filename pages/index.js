import Head from "next/head";
import Image from "next/image";
import { useMoralisQuery, useMoralis } from "react-moralis";
import styles from "../styles/Home.module.css";
import NftBox from "../components/NftBox";

export default function Home() {
  const { isWeb3Enabled } = useMoralis();
  const { data: listedNft, fetchingListedNfts } = useMoralisQuery(
    "ActiveItem",
    (query) => query.limit(10).descending("tokenId")
  );
  console.log(listedNft);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          fetchingListedNfts ? (
            <div>Loading...</div>
          ) : (
            listedNft.map((nft) => {
              console.log(nft.attributes);
              const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                nft.attributes;
              return (
                <div>
                  <NftBox
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketplaceAddress={marketplaceAddress}
                    seller={seller}
                    key={`${nftAddress}${tokenId}`}
                  />
                </div>
              );
            })
          )
        ) : (
          <div>Web3 currenlty is not enabled</div>
        )}
      </div>
    </div>
  );
}
