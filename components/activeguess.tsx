import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import cx from "classnames";
import React from "react";
import { validButNotChosen, validWords } from "./validWords";
import { KeyContext, KeyContextProps } from "./keyContext";

export interface WordGuessProps {
    children?: React.ReactElement;
    disabled?: boolean;
    finalWord: string;
    onAccept: (word: string) => void;
    nextKey?: string;
}

export default function ActiveGuess({
    children,
    disabled = false,
    finalWord,
    onAccept,
    nextKey,
}: WordGuessProps) {
    const [letters, setLetters] = React.useState<string[]>([]);
    const maxLetters = React.useMemo(() => finalWord?.length ?? 5, [finalWord]);

    React.useEffect(() => {
        if (nextKey) {
            const key = nextKey.toUpperCase();
            if (
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(key) &&
                letters.length < maxLetters
            ) {
                setLetters((last) => [...last, key]);
            }
        }
    }, [nextKey, letters.length, maxLetters, setLetters]);

    const onKeyPress = React.useCallback(
        (ev: KeyboardEvent) => {
            if (disabled) {
                return;
            }
            if (ev.ctrlKey || ev.altKey) {
                return;
            }
            if (ev.key == "Enter" && letters.length == maxLetters) {
                // check that the word is valid first.
                const currentWord = R.join("", letters);

                const isValid = R.includes(currentWord.toLowerCase(), [
                    ...validWords,
                    ...validButNotChosen,
                ]);

                if (isValid) {
                    onAccept(currentWord);
                    setLetters([]);
                }
            } else if (ev.key == "Backspace") {
                setLetters((last) => {
                    if (last.length > 0) {
                        return last.slice(0, last.length - 1);
                    }
                    return last;
                });
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
        [disabled, setLetters, letters, onAccept, maxLetters]
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
                extraChars = [...extraChars, "_"];
            }
            return [...letters, ...extraChars];
        } else {
            return letters;
        }
    }, [letters, finalWord, maxLetters]);

    const contextValue = React.useMemo<KeyContextProps>(
        () => ({
            onKeyPress: onKeyPress,
        }),
        [onKeyPress]
    );

    return (
        <>
            {!disabled && (
                <div className={styles.word}>
                    {shownLetters.map((letterItem, index) => {
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
            )}
            <KeyContext.Provider value={contextValue}>
                {children}
            </KeyContext.Provider>
        </>
    );
}
