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
  latlong = "43.75,-79.44",
  limit = 6,
  query = "coffee stores"
) => {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: "fsq3A9KX5958CN7vKoCj9PYA77jFNroEkVQxp3jcn6ydH1U=",
    },
  };

  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?ll=${latlong}&query=${query}&limit=${limit}`,
    options
  );

  const photos = await fetchPhotos();

  const data = await response.json();

  const venues = data.results.map((result, index) => {
    return {
      ...result,
      imgUrl: photos[index],
    };
  });

  return venues;
};
