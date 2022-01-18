import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";

export interface WordGuessProps {
    word: string;
    master: string;
}

export default function WordGuess({ word, master }: WordGuessProps) {
    let items: any[] = [];
    for (let i = 0; i < word.length; i++) {
        items.push({
            letter: word[i].toUpperCase(),
            style:
                word[i].toUpperCase() == master[i].toUpperCase()
                    ? styles.okay
                    : styles.bad,
        });
    }

    return (
        <div className={styles.word}>
            {items.map((letterItem, index) => {
                return (
                    <div key={index} className={styles.letter}>
                        {letterItem.letter}
                    </div>
                );
            })}
        </div>
    );
}
