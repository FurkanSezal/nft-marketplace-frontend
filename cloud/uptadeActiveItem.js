//
//

Moralis.Cloud.afterSave("ItemListed", async (request) => {
  // every event gets triggered twice. One unconfirmed one confirmed.
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info("Looking for confirmed Tx");

  if (confirmed) {
    logger.info("Found Item!");
    // this say if activeItem exist, ok grep it, if not create ActiveItem table
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    // check for the item is already exist if it is,
    // get rid of the item
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));

    const alreadyListed = await query.first();

    if (alreadyListed) {
      logger.info(`Deleting already listed ${request.object.get("objectId")}`);
      await alreadyListed.destroy();
      logger.info(
        `Deleted item with tokenId ${request.object.get(
          "tokenId"
        )} at address ${request.object.get(
          "address"
        )} since it's already been listed`
      );
    }
    // we are creating new activeItem entry for table..
    const activeItem = new ActiveItem();
    // on our new table we are adding what coloums we want

    activeItem.set("marketplaceAddress", request.object.get("address"));
    activeItem.set("nftAddress", request.object.get("nftAddress"));
    activeItem.set("price", request.object.get("price"));
    activeItem.set("tokenId", request.object.get("tokenId"));
    activeItem.set("seller", request.object.get("seller"));

    logger.info(
      `Adding Address: ${request.object.get(
        "address"
      )}. Token Id: ${request.object.get("tokenId")}`
    );
    logger.info("Saving...");
    await activeItem.save();
  }
});

Moralis.Cloud.afterSave("ItemCanceled", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Object: ${request.object}`);

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    logger.info(`Marketplace | Object: ${query}`);
    // We will find first canceled item in ActiveItem table with
    // that tokenId,marketplace address,nftaddress
    const canceledItem = await query.first();
    logger.info(`Marketplace | CanceledItem ${canceledItem}`);
    if (canceledItem) {
      // If query doesnt finf anything
      // it will return undefined
      logger.info(
        `Deleting ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")} since it was canceled`
      );
      await canceledItem.destroy();
    } else {
      logger.info(
        `No Item found with ${request.object.get(
          "address"
        )} and tokenId: ${request.object.get("tokenId")}`
      );
    }
  }
});

Moralis.Cloud.afterSave("ItemBought", async (request) => {
  const confirmed = request.object.get("confirmed");
  const logger = Moralis.Cloud.getLogger();
  logger.info(`Marketplace | Object: ${request.object}`);
  if (confirmed) {
    const ActiveItem = Moralis.Object.extend("ActiveItem");
    const query = new Moralis.Query(ActiveItem);
    query.equalTo("marketplaceAddress", request.object.get("address"));
    query.equalTo("nftAddress", request.object.get("nftAddress"));
    query.equalTo("tokenId", request.object.get("tokenId"));
    logger.info(`Marketplace | Object: ${query}`);
    const boughtItem = await query.first();
    if (boughtItem) {
      logger.info(`Deleting ${request.object.get("objectId")}`);
      await boughtItem.destroy();
      logger.info(
        `Deleted item with TokenId ${request.object.get(
          "tokenId"
        )} at address ${request.object.get("address")}`
      );
    } else {
      logger.info(
        `No item found with address ${request.object.get(
          "address"
        )} and tokenId: ${request.object.get("tokenıd")}`
      );
    }
  }
});
