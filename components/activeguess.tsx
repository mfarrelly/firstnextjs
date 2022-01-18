import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import cx from "classnames";
import React from "react";

export interface WordGuessProps {
    master: string;
    onAccept: (word: string) => void;
}

export default function ActiveGuess({ master, onAccept }: WordGuessProps) {
    const [letters, setLetters] = React.useState<string[]>([]);

    const onKeyPress = React.useCallback(
        (ev: KeyboardEvent) => {
            if (ev.key == "Enter") {
                onAccept(R.join("", letters));
                setLetters([]);
            } else {
                setLetters((last) => [...last, ev.key]);
            }
        },
        [setLetters, letters, onAccept]
    );
    React.useEffect(() => {
        document.addEventListener("keyup", onKeyPress);
        return () => {
            document.removeEventListener("keyup", onKeyPress);
        };
    }, [onKeyPress]);

    return (
        <div className={styles.word}>
            {letters.map((letterItem, index) => {
                // const isOk = letterItem.isOk;
                // const isOutOfPosition = letterItem.isOutOfPosition;
                return (
                    <div
                        key={index}
                        className={cx({
                            [styles.letter]: true,
                        })}
                    >
                        {letterItem}
                    </div>
                );
            })}
        </div>
    );
}
