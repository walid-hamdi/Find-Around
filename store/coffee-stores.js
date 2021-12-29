import { createContext, useReducer } from "react";

export const TYPES = {
  STORES_LAT_LONG: "LAT_LONG",
  STORES_COFFEE_STORES: "COFFEE_STORES",
};

export const StoreContext = createContext();

const storeReducer = (state, action) => {
  switch (action.type) {
    case TYPES.STORES_LAT_LONG:
      return { ...state, lat_long: action.payload.lat_long };
    case TYPES.STORES_COFFEE_STORES:
      return { ...state, coffeeStores: action.payload.coffeeStores };

    default:
      throw new Error("Error here", action.type);
  }
};

const ContextProvider = ({ children }) => {
  const initialState = {
    lat_long: "",
    coffeeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default ContextProvider;
