import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Form, useNotification } from "web3uikit";
import { ethers } from "ethers";
import nftAbi from "../constants/BasicNft.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";

export default function Home() {
  const { chainId } = useMoralis();
  // chain Id comes hex
  const chainString = chainId ? parseInt(chainId).toString() : "31337";

  const marketplaceAddress = networkMapping[chainString].NftMarketplace[0];

  const { runContractFunction } = useWeb3Contract();
  const dispatch = useNotification();

  async function apporveAndList(data) {
    console.log("approving...");
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onError: (error) => {
        console.log(error);
      },
      onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
    });
    async function handleApproveSuccess() {
      console.log("Ok! Now time to list..");
      const listOptions = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "listItem",
        params: {
          nftAddress: nftAddress,
          tokenId: tokenId,
          price: price,
        },
      };

      await runContractFunction({
        params: listOptions,
        onSuccess: handleListSuccess,
        onError: (error) => console.log(error),
      });

      async function handleListSuccess(tx) {
        await tx.wait(1);
        dispatch({
          type: "Success",
          message: "NFT Listing..",
          title: "NFt listed",
          position: "topR",
        });
      }
    }
  }

  return (
    <div className={styles.container}>
      <Form
        onSubmit={apporveAndList}
        data={[
          {
            name: "NFT Address",
            type: "text",
            inputWidth: "%50",
            value: "",
            key: "nftAddress",
          },
          {
            name: "Token ID",
            type: "number",
            value: "",
            key: "tokenId",
          },
          { name: "price (in ETH)", type: "number", value: "", key: "price" },
        ]}
        title="Sell your NFTs!"
        id="Main Form"
      />
    </div>
  );
}
