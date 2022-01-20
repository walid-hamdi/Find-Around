import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: "HW2Y-UJxDKrnIRbLdVl58THvDaLvwaJBYykKn1NSG0U",
});

const fetchPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee",
    perPage: 40,
  });
  return photos.response.results.map((photo) => photo.urls["small"]);
};

export const fetchCoffeeStores = async (
  lat_long = "43.75,-79.44",
  limit = 12,
  query = "coffee stores"
) => {
  try {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "fsq3zVP7aVwLzL7NmwyMT1zahLLVeJaI2vge3h2/+AJRtXI=",
      },
    };

    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat_long}&limit=${limit}&categories=13000`,
      options
    );

    const data = await response.json();
    const photos = await fetchPhotos();

    const venues = data.results.map((result, index) => {
      return {
        ...result,
        imgUrl: photos[index],
      };
    });

    return venues;
  } catch (err) {
    console.log(err);
  }
};
