import {DEFAULT_DIFFICULTY} from "../constants/config.js";

export const state = {
     sequence: [],
     recentSequence: [],
     pressedKeys: [],
     currentRound: 1,
     currentDifficulty: DEFAULT_DIFFICULTY,

     tryCount: 1,
     keyPressedOnce: false,
     activeKey: null,
     inputBlocked: true,
}
