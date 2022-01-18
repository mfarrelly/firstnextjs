import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import cx from "classnames";

export interface WordGuessProps {
    word: string;
    master: string;
}

export default function WordGuess({ word, master }: WordGuessProps) {
    let items: any[] = [];
    for (let i = 0; i < word.length; i++) {
        items.push({
            letter: word[i].toUpperCase(),
            isOk: word[i].toUpperCase() === master[i].toUpperCase(),
            isOutOfPosition:
                word[i].toUpperCase() !== master[i].toUpperCase() &&
                master.includes(word[i]),
        });
    }

    return (
        <div className={styles.word}>
            {items.map((letterItem, index) => {
                const isOk = letterItem.isOk;
                const isOutOfPosition = letterItem.isOutOfPosition;
                return (
                    <div
                        key={index}
                        className={cx(
                            {
                                [styles.letter]: true,
                            },
                            { [styles.okay]: isOk },
                            { [styles.outOfPosition]: isOutOfPosition }
                        )}
                    >
                        {letterItem.letter}
                    </div>
                );
            })}
        </div>
    );
}
