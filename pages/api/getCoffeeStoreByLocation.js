import { fetchCoffeeStores } from "../../lib/coffee-shop";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const getCoffeeStoreByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json(response);
  } catch (err) {
    res.status(500);
    res.json({ message: "Oh no there is an error", err });
  }
};

export default getCoffeeStoreByLocation;
