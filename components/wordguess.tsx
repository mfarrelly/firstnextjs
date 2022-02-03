import styles from "../styles/WordGuess.module.css";
import * as R from "ramda";
import cx from "classnames";
import React from "react";
import { analyze } from "./util";
import { Badge, Chip, Button, ButtonGroup, Grid, Paper } from "@mui/material";

export interface WordGuessProps {
    word: string;
    finalWord: string;
}

export default function WordGuess({ word, finalWord = "" }: WordGuessProps) {
    let items = React.useMemo(() => {
        if (!finalWord) {
            return [];
        }
        const result = analyze([word], finalWord);
        return result[0].data;
    }, [word, finalWord]);

    return (
        <Grid container sx={{ flexGrow: 1 }} justifyContent="center">
            {items.map((letterItem, index) => {
                const isOk = letterItem.isOk;
                const isOutOfPosition = letterItem.isOutOfPosition;
                return (
                    <Grid key={index} item xs={1}>
                        <Chip
                            color={
                                isOk
                                    ? "success"
                                    : isOutOfPosition
                                    ? "secondary"
                                    : undefined
                            }
                            label={letterItem.letter}
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
}
