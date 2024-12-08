const knex = require("knex")(require("../knexfile"));

const getMainPersonalized = async (req, res) => {
  const allProducts = await knex("products").where("user_id", req.body.userId);
  const sortedProducts = allProducts.sort(
    (a, b) => a.preference_score - b.preference_score
  );

  // FETCHING SOURCES FOR ALL PRODUCTS
  const allProductsWithSources = await Promise.all(
    sortedProducts.map(async (product) => {
      const sources = await knex("sources")
        .where("product_id", product.id)
        .orderBy("source_score", "desc") // order sources in descending order of source_scores
        .first(); // pick the first source which is the heighest score
      return {
        productId: product.id,
        productName: product.name,
        preferenceScore: product.preference_score,
        sources: sources,
      };
    })
  );
  res.status(200).json(allProductsWithSources);
};
module.exports = { getMainPersonalized };
