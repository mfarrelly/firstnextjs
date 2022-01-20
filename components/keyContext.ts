import React from "react";

export interface KeyContextProps {
    onKeyPress: (ev: KeyboardEvent) => void;
}
export const KeyContext = React.createContext<KeyContextProps>({
    onKeyPress: (ev) => {
        // do nothing yet.
    },
});
