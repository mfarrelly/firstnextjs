import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import cx from "classnames";
import React from "react";

export interface WordGuessProps {
    word: string;
    finalWord: string;
}

export default function WordGuess({ word, finalWord = "" }: WordGuessProps) {
    let items: any[] = React.useMemo(() => {
        if (!finalWord) {
            return [];
        }
        const a = [];
        for (let i = 0; i < word.length; i++) {
            if (i < finalWord.length) {
                a.push({
                    letter: word[i].toUpperCase(),
                    isOk: word[i].toUpperCase() === finalWord[i].toUpperCase(),
                    isOutOfPosition:
                        word[i].toUpperCase() !== finalWord[i].toUpperCase() &&
                        finalWord.includes(word[i]),
                });
            }
        }
        return a;
    }, [word, finalWord]);

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
