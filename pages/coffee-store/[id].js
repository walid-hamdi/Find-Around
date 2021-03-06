import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";

import { fetchCoffeeStores } from "../../lib/coffee-shop";
import { StoreContext } from "../../store/coffee-stores";
import { isEmpty } from "../../utils";
import useSWR from "swr";
import styles from "../../styles/detail.module.css";
import cs from "classnames";

function CoffeeStore(initialProps) {
  const route = useRouter();

  if (route.isFallback) {
    return <h1>Loading...</h1>;
  }

  const id = route.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const { state } = useContext(StoreContext);
  const { coffeeStores: coffeeStoresContext } = state;

  const handleCreateStores = async (coffee) => {
    try {
      const { id, name, imgUrl, neighbourhood, address } = coffee;

      const response = await fetch("/api/createCoffeeStores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {}
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStoresContext.length > 0) {
        const findCoffeeFromContext = coffeeStoresContext.find((coffee) => {
          return coffee.id.toString() === id;
        });

        if (findCoffeeFromContext) {
          setCoffeeStore(findCoffeeFromContext);
          handleCreateStores(findCoffeeFromContext);
        }
      }
    } else {
      handleCreateStores(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  const { address, name, imgUrl } = coffeeStore;

  const [voting, setVoting] = useState(0);

  const handleUpVote = async () => {
    try {
      const response = await fetch("/api/updateFavoriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVoting(voting + 1);
      }
    } catch (err) {
      console.error("Err: ", err);
    }
  };

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVoting(data[0].voting);
    }
  }, [data]);

  {
    error && <p>{error}</p>;
  }

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.backWrapper}>
          <Link href="/">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 0 24 24"
                width="48px"
                fill="#fff"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
              </svg>
            </a>
          </Link>
        </div>
        <div className={styles.itemWrapper}>
          <div className={cs([styles.itemWrapperCard, "glass"])}>
            <h1 className={styles.mainTitle}>{name}</h1>
            <div className={styles.imgWrapper}>
              <Image
                src={
                  imgUrl ||
                  "https://images.unsplash.com/photo-1640020580603-e7beafd75d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80"
                }
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className={cs([styles.content, "glass"])}>
            <h1 className={styles.addressText}>
              <span className={styles.addressIconWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="48px"
                  viewBox="0 0 24 24"
                  width="48px"
                  fill="#ffffff"
                >
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
                </svg>
              </span>
              <span>{address}</span>
            </h1>

            <div className={styles.voteWrapper}>
              <p className={styles.voteText}>{voting}</p>
            </div>

            <button className={styles.upVoteButton} onClick={handleUpVote}>
              Up Vote
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CoffeeStore;

export async function getStaticProps({ params }) {
  const coffeeStoreData = await fetchCoffeeStores();

  const coffeeStoreById = coffeeStoreData.find(
    (coffee) => coffee.id.toString() === params.id
  );

  return {
    props: {
      coffeeStore: coffeeStoreById ? coffeeStoreById : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStoreData = await fetchCoffeeStores();

  const paths = coffeeStoreData.map((coffee) => {
    return {
      params: {
        id: coffee.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}
