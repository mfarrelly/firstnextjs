import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import cx from "classnames";
import React from "react";
import { analyze } from "./util";

export interface WordGuessProps {
    word: string;
    finalWord: string;
}

export default function WordGuess({ word, finalWord = "" }: WordGuessProps) {
    let items = React.useMemo(() => {
        if (!finalWord) {
            return [];
        }
        const a = analyze([word], finalWord);
        return a[0].data;
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
