import React from "react";

const MultisigContext = React.createContext(null);
const MultisigDispatchContext = React.createContext(null);

const initialState = {
  publicKeyList: {},
  quorum: {
    m: 2,
    n: 2,
  },
  multisigAddress: null,
  currentMultisigTransaction: null,
  sigHashList: [],
  redeemScript: null,
  signatures: {},
};

const initialStateTEST = initialState;

// const initialStateTEST = {
//   publicKeyList: {
//     0: "042cf12c3d2260a13fab088fc1ab75196c263e1debc1a701c6e950573233655c1840bceecad7aae4c2ff31718ec4eb8c45e74b34aeb37c48b21824dbde983ac072",
//     1: "04b91f2130d53bed05c73a3a3a74d87922aba5be79451247a410520190e69314ff67fe759ce3e02389f6d3186712880cbe0f3a8fd74236e95d7dfcf6890941aa10",
//   },
//   quorum: {
//     m: 2,
//     n: 2,
//   },
//   multisigAddress: "2MzrsjzPEQvCHne1ociNwccV9jk7xej4AbV",
//   currentMultisigTransaction:
//     "0100000001594659404627aaaeba2ef5d7b3aaba5ea85feccd7a921849c69c2c731d4b552e0000000000ffffffff0288130000000000001976a91484f8e08b00d6bb2cc2f419ea6bd598b68dcbced088acb41100000000000017a9145386f4486fb6d31b4bce62e0a4941a273b9e53988700000000",
//   sigHashList: [
//     "f7b7bf7e7e7822de3f4bc10a73c78fa139e5b80947a22457e7c89e571bc95424",
//   ],
//   redeemScript:
//     "5241042cf12c3d2260a13fab088fc1ab75196c263e1debc1a701c6e950573233655c1840bceecad7aae4c2ff31718ec4eb8c45e74b34aeb37c48b21824dbde983ac0724104b91f2130d53bed05c73a3a3a74d87922aba5be79451247a410520190e69314ff67fe759ce3e02389f6d3186712880cbe0f3a8fd74236e95d7dfcf6890941aa1052ae",
//   signatures: {
//     0: {
//       r: "46a78b8ea8c90032d36f9450d51721b33a157651337ee31538d7214c7b16f76b",
//       s: "62a3694ebcaa59855f55c549e06a94c85c086314d21b8f79e2e4bb36c4ea7f1e",
//     },
//     1: {
//       r: "63b0e178e6fb89b11c492a1b625cfce7494530d236e0ca06a0b61028d276effb",
//       s: "00f608da0fe0b0f7701f352c051b9a149b0fa98e4ab76d66087dd1cff09d0b8e",
//     },
//   },
// };

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PUBLIC_KEY":
      return {
        ...state,
        publicKeyList: {
          ...state.publicKeyList,
          [action.payload.keyIndex]: action.payload.value,
        },
      };
    case "UPDATE_QUORUM":
      return {
        ...state,
        quorum: {
          ...state.quorum,
          ...action.payload,
        },
      };
    case "SET_MULTISIG_ADDRESS":
      return {
        ...state,
        multisigAddress: action.payload,
      };
    case "ADD_SIGNATURE":
      return {
        ...state,
        signatures: {
          ...state.signatures,
          [action.payload.keyIndex]: action.payload.value,
        },
      };
    case "SET_PENDING_TRANSACTION":
      return {
        ...state,
        currentMultisigTransaction: action.payload,
      };
    case "SET_REDEEM_SCRIPT":
      return {
        ...state,
        redeemScript: action.payload,
      };
    case "SET_SIG_HASH_LIST":
      return {
        ...state,
        sigHashList: action.payload,
      };
    default:
      return state;
  }
};

export const MultisigContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialStateTEST);

  return (
    <MultisigContext.Provider value={state}>
      <MultisigDispatchContext.Provider value={dispatch}>
        {children}
      </MultisigDispatchContext.Provider>
    </MultisigContext.Provider>
  );
};

export function useMultisigContext() {
  return React.useContext(MultisigContext);
}

export function useMultisigDispatchContext() {
  return React.useContext(MultisigDispatchContext);
}
