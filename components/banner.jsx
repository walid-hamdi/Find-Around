import React from "react";
import styles from "./banner.module.css";

function Banner({ buttonText, onClick }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Shop</span>
      </h1>
      <p className={styles.subtitle}>Discover your local coffee shops!</p>
      <button onClick={onClick} className={styles.button}>
        {buttonText}
      </button>
    </div>
  );
}
export default Banner;
