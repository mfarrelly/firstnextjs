import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import React from "react";
import cx from "classnames";

export interface KeyboardProps {
    letters: string[];
    okLetters: string[];
    outOfPositionLetters: string[];
}

export default function Keyboard({
    letters,
    okLetters,
    outOfPositionLetters,
}: KeyboardProps) {
    // let items: any[] = [];
    // for (let i = 0; i < word.length; i++) {
    //     items.push({
    //         letter: word[i].toUpperCase(),
    //         style:
    //             word[i].toUpperCase() == master[i].toUpperCase()
    //                 ? styles.okay
    //                 : styles.bad,
    //     });
    // }
    // return (
    //     <div className={styles.word}>
    //         {items.map((letterItem, index) => {
    //             return (
    //                 <div key={index} className={styles.letter}>
    //                     {letterItem.letter}
    //                 </div>
    //             );
    //         })}
    //     </div>
    // );

    const keys = React.useMemo(() => {
        return [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["Z", "X", "C", "V", "B", "N", "M"],
        ];
    }, []);

    const styledKeys = React.useMemo(() => {
        return keys.map((keyRow, rowi) => {
            return (
                <div className={styles.keyRow}>
                    {keyRow.map((k, ki) => {
                        const isOk = R.includes(k, okLetters);
                        const isOutOfPosition = R.includes(
                            k,
                            outOfPositionLetters
                        );
                        const hasGuessed = R.includes(k, letters);
                        return (
                            <div
                                key={`k${rowi}_${ki}`}
                                className={cx(
                                    { [styles.key]: true },
                                    { [styles.okay]: isOk },
                                    { [styles.outOfPosition]: isOutOfPosition },
                                    { [styles.guessed]: hasGuessed }
                                )}
                            >
                                {k}
                            </div>
                        );
                    })}
                </div>
            );
        });
    }, []);

    return <div>{styledKeys}</div>;
}
