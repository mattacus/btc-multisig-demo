import React from "react";

const MultisigKeyContext = React.createContext(null);
const MultisigKeyDispatchContext = React.createContext(null);

const initialState = {
  publicKeyList: {},
  quorum: {
    m: 2,
    n: 2,
  },
  multisigAddress: null,
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
    default:
      return state;
  }
};

export const MultisigKeyContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialStateTEST);

  return (
    <MultisigKeyContext.Provider value={state}>
      <MultisigKeyDispatchContext.Provider value={dispatch}>
        {children}
      </MultisigKeyDispatchContext.Provider>
    </MultisigKeyContext.Provider>
  );
};

export function useMultisigKeyContext() {
  return React.useContext(MultisigKeyContext);
}

export function useMultisigKeyDispatchContext() {
  return React.useContext(MultisigKeyDispatchContext);
}
