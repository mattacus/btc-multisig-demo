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
  sigHashList: null,
  signatures: {},
};

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
    "0100000001758428e84f5e4322a92b51a1cfcc14cf59208cb10f485092aa2324a9d05082ef0000000000ffffffff0288130000000000001976a91484f8e08b00d6bb2cc2f419ea6bd598b68dcbced088acb91200000000000017a914e8a482d30c69fb395152ad5c467a59ffb754bbae8700000000",
  sigHashList: [
    "f03a72ff8bb657e023817857d82a6a3dea9e37b7bffbf4be4e499d4ff8b6bf9a",
  ],
  signatures: {
    // 0: {
    //   r: "4ec12e720bd10f4bf7d164963f1919378e98495ede138b5f16eb93ae08db3f5d",
    //   s: "7b20d5e6127b170784dfde78b778f43dc01477e423489a8489c4e9cd9a010d09",
    // },
    // 1: {
    //   r: "69eb5fca47edfb203831cca99ad807273d7173728e3a92409d412313074e291e",
    //   s: "57b9ca1785eea1c4532c55a3ba5f6f33aa4a1afc266e88dee2db126b275f10f1",
    // },
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_PUBLIC_KEY":
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
