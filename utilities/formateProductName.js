const formateProductName = (productName) => {
    const productNameArray = productName.split(" ");
    let productNameConcate = "";
    for (let index = 0; index < productNameArray.length; index++) {
      productNameConcate = productNameConcate
        ? `${productNameConcate}+${productNameArray[index]}`
        : productNameArray[index];
    }
    return productNameConcate;
  };

  module.exports = formateProductName;