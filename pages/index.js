import Head from "next/head";
import Image from "next/image";
import Banner from "../components/banner";
import Card from "../components/card";
import styles from "../styles/Home.module.css";
import { fetchCoffeeStores } from "../lib/coffee-shop";
import useTrackLocation from "../hooks/useTrackLocation";
import { useContext, useEffect, useState } from "react";
import { StoreContext, TYPES } from "../store/coffee-stores";

export default function Home({ coffeeStore }) {
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores: nearByStores, lat_long } = state;
  const [error, setError] = useState("");

  const { isFindingLoading, errorMessage, handleTrackLocation } =
    useTrackLocation();

  useEffect(async () => {
    if (lat_long) {
      try {
        const response = await fetch(
          `/api/getCoffeeStoreByLocation?latLong=${lat_long}&limit=${20}`
        );
        const coffeeStores = await response.json();

        dispatch({
          type: TYPES.STORES_COFFEE_STORES,
          payload: { coffeeStores },
        });
        setError("");
      } catch (error) {
        setError(error);
      }
    }
  }, [lat_long]);

  const handleOnClick = () => {
    handleTrackLocation();
  };

  const loadStores = (stores, nearBy) => {
    return (
      <>
        {nearBy.length > 0 && (
          <h1 className={styles.heading2}>Nearby Stores</h1>
        )}
        {error && <p>{error}</p>}
        <div className={styles.cardLayout}>
          {nearBy &&
            nearBy.map((coffee) => {
              return (
                <Card
                  key={coffee.fsq_id}
                  className={styles.card}
                  heading={coffee.name}
                  imageUrl={
                    coffee.imgUrl ||
                    "https://images.unsplash.com/photo-1640020580603-e7beafd75d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80"
                  }
                  href={`/coffee-store/${coffee.fsq_id}`}
                />
              );
            })}
        </div>

        {stores.length > 0 && (
          <h1 className={styles.heading2}>New York Stores</h1>
        )}
        <div className={styles.cardLayout}>
          {stores &&
            stores.map((coffee) => {
              return (
                <Card
                  key={coffee.fsq_id}
                  className={styles.card}
                  heading={coffee.name}
                  imageUrl={
                    coffee.imgUrl ||
                    "https://images.unsplash.com/photo-1640020580603-e7beafd75d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80"
                  }
                  href={`/coffee-store/${coffee.fsq_id}`}
                />
              );
            })}
        </div>
      </>
    );
  };

  return (
    <div>
      <Head>
        <title>Home | Find Around </title>
      </Head>
      <main className={styles.container}>
        <div className={styles.banner}>
          <Banner
            buttonText={isFindingLoading ? "Loading..." : "Find Coffee Shops"}
            onClick={handleOnClick}
          />
          {errorMessage && <p>{errorMessage}</p>}
          <div className={styles.hero}>
            <Image
              className={styles.img}
              src="/static/hero-image.png"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

        {loadStores(coffeeStore, nearByStores)}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const coffeeStore = await fetchCoffeeStores();
  return {
    props: { coffeeStore },
  };
}
