import { StoreContext, TYPES } from "../store/coffee-stores";

const { useState, useContext } = require("react");

const useTrackLocation = () => {
  const { dispatch } = useContext(StoreContext);

  const [errorMessage, setErrorMessage] = useState("");
  const [isFindingLoading, setIsFindingLoading] = useState(false);

  const error = () => {
    setErrorMessage("Sorry you can't access to location!");
    setIsFindingLoading(false);
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setErrorMessage("");
    dispatch({
      type: TYPES.STORES_LAT_LONG,
      payload: { lat_long: `${latitude},${longitude}` },
    });
    setIsFindingLoading(false);
  };

  const handleTrackLocation = () => {
    setIsFindingLoading(true);
    if (!navigator.geolocation) {
      setErrorMessage("Your browser doesn't support getting location!");
      setIsFindingLoading(false);
    } else {
      navigator.geolocation.watchPosition(success, error);
    }
  };

  return {
    handleTrackLocation,
    errorMessage,
    isFindingLoading,
  };
};

export default useTrackLocation;
