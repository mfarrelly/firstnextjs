import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import React from "react";
import cx from "classnames";
import { KeyContext } from "./keyContext";

export interface VisualKeyboardProps {
    letters: string[];
    okLetters: string[];
    outOfPositionLetters: string[];
}

export default function VisualKeyboard({
    letters,
    okLetters,
    outOfPositionLetters,
}: VisualKeyboardProps) {
    const { onKeyPress } = React.useContext(KeyContext);

    const keys = React.useMemo(() => {
        return [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Backspace"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["Z", "X", "C", "V", "B", "N", "M", "Enter"],
        ];
    }, []);

    const styledKeys = React.useMemo(() => {
        return keys.map((keyRow, rowi) => {
            return (
                <div key={`keyrow_${rowi}`} className={styles.keyRow}>
                    {keyRow.map((k, ki) => {
                        const isOk = R.includes(k, okLetters);
                        const isOutOfPosition = R.includes(
                            k,
                            outOfPositionLetters
                        );
                        const hasGuessed =
                            R.includes(k, letters) && !isOk && !isOutOfPosition;
                        return (
                            <div
                                key={`k${rowi}_${ki}`}
                                className={cx(
                                    { [styles.key]: true },
                                    { [styles.guessed]: hasGuessed },
                                    { [styles.okay]: isOk },
                                    { [styles.outOfPosition]: isOutOfPosition }
                                )}
                                onClick={() =>
                                    // mock a keyboard event.
                                    onKeyPress({ key: k } as KeyboardEvent)
                                }
                            >
                                {k}
                            </div>
                        );
                    })}
                </div>
            );
        });
    }, [keys, outOfPositionLetters, okLetters, letters, onKeyPress]);

    return <div>{styledKeys}</div>;
}
