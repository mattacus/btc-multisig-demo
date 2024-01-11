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
  multisigAddress: null,
  signatures: {},
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