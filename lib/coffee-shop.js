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

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

export const fetchCoffeeStores = async (
  latLong = "43.65267326999575,-79.39545615725015",
  limit = 12
) => {
  const photos = await fetchPhotos();
  const response = await fetch(
    getUrlForCoffeeStores(latLong, "coffee stores", limit),
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );
  const data = await response.json();

  return (
    data.results?.map((venue, idx) => {
      return {
        id: venue.fsq_id,
        address: venue.location.address || "",
        name: venue.name,
        neighbourhood:
          venue.location.neighborhood || venue.location.crossStreet || "",
        imgUrl: photos[idx],
      };
    }) || []
  );
};

// export const fetchCoffeeStores = async (
//   lat_long = "43.75,-79.44",
//   limit = 12,
//   query = "coffee stores"
// ) => {
//   try {
//     const options = {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         Authorization: "fsq3zVP7aVwLzL7NmwyMT1zahLLVeJaI2vge3h2/+AJRtXI=",
//       },
//     };

//     const response = await fetch(
//       `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat_long}&limit=${limit}&categories=13000`,
//       options
//     );

//     const data = await response.json();
//     const photos = await fetchPhotos();

//     const venues = data.results.map((result, index) => {
//       return {
//         ...result,
//         imgUrl: photos[index],
//       };
//     });

//     return venues;
//   } catch (err) {
//     console.log(err);
//   }
// };
