import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";

let CustomAssets = findByProps("getAnimatableSourceWithFallback")
let unpatch;

export default {
    onLoad: () => {
        unpatch = before("getAnimatableSourceWithFallback", CustomAssets, (args) => {
            args[0] = false;
        });
    },
    onUnload: () => {
        unpatch();
    }
};