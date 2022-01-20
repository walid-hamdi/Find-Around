import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./card.module.css";
import cn from "classnames";

export default function Card({ heading, imageUrl, href }) {
  return (
    <Link href={href}>
      <a className={styles.cardLink}>
        <div className={cn("glass", styles.container)}>
          <div className={styles.cardHeadingWrapper}>
            <h3 className={styles.cardHeading}>{heading}</h3>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              className={styles.cardImage}
              src={imageUrl}
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </a>
    </Link>
  );
}
