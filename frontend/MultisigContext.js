import React from "react";

const MultisigContext = React.createContext(null);
const MultisigDispatchContext = React.createContext(null);

// const initialState = {
//   publicKeyList: {},
//   quorum: {
//     m: 2,
//     n: 2,
//   },
//   multisigAddress: null,
//   currentMultisigTransaction: null,
//   sigHashList: [],
//   redeemScript: null,
//   signatures: {},
// };

const initialStateTEST = {
  publicKeyList: {
    0: "04abe79ee2c3c4d32b43b38d2043b07908a91efb5c6c5a022256c243e8b14941b0fad97c83b71a5072042ef0062f1ee23016a9c57cb582b7a74f0b1ace7938f994",
    1: "04cff54e130bd54a843a46ab955852fdbf737e461856a4ecfa73593d188a0faa1ecccf724e3310d881c327a7d11a0f138b18c01b73d15d449523eb0919af04b769",
  },
  quorum: {
    m: 2,
    n: 2,
  },
  multisigAddress: "2NETKqDTQ7BcZQ1JbZfweYfjg5cJArKj91g",
  currentMultisigTransaction:
    "0100000001758428e84f5e4322a92b51a1cfcc14cf59208cb10f485092aa2324a9d05082ef0000000000ffffffff0288130000000000001976a91484f8e08b00d6bb2cc2f419ea6bd598b68dcbced088acb41100000000000017a914e8a482d30c69fb395152ad5c467a59ffb754bbae8700000000",
  redeemScript:
    "524104abe79ee2c3c4d32b43b38d2043b07908a91efb5c6c5a022256c243e8b14941b0fad97c83b71a5072042ef0062f1ee23016a9c57cb582b7a74f0b1ace7938f9944104cff54e130bd54a843a46ab955852fdbf737e461856a4ecfa73593d188a0faa1ecccf724e3310d881c327a7d11a0f138b18c01b73d15d449523eb0919af04b76952ae",
  sigHashList: [],
  signatures: {},
};

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
