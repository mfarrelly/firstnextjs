import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import cx from "classnames";
import React from "react";

export interface WordGuessProps {
    finalWord: string;
    onAccept: (word: string) => void;
}

export default function ActiveGuess({ finalWord, onAccept }: WordGuessProps) {
    const [letters, setLetters] = React.useState<string[]>([]);
    const maxLetters = React.useMemo(() => finalWord?.length ?? 5, [finalWord]);

    const onKeyPress = React.useCallback(
        (ev: KeyboardEvent) => {
            if (ev.key == "Enter" && letters.length == maxLetters) {
                // check that the word is valid first.
                console.log(`activeguess`, letters, finalWord);
                onAccept(R.join("", letters));
                setLetters([]);
            } else {
                const key = ev.key.toUpperCase();
                if (
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(key) &&
                    letters.length < maxLetters
                ) {
                    setLetters((last) => [...last, key]);
                }
            }
        },
        [setLetters, letters, onAccept, maxLetters, finalWord]
    );
    React.useEffect(() => {
        document.addEventListener("keyup", onKeyPress);
        return () => {
            document.removeEventListener("keyup", onKeyPress);
        };
    }, [onKeyPress]);

    const shownLetters = React.useMemo(() => {
        if (!finalWord) {
            return [];
        }
        if (letters.length < finalWord.length) {
            const pads = maxLetters - letters.length;
            let extraChars: string[] = [];
            for (let i = 0; i < pads; i++) {
                extraChars = [...extraChars, ""];
            }
            return [...letters, ...extraChars];
        } else {
            return letters;
        }
    }, [letters, finalWord, maxLetters]);

    return (
        <div className={styles.word}>
            {shownLetters.map((letterItem, index) => {
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
