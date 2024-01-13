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
  redeemScript: null,
  signatures: {},
};

const initialStateTEST = {
  publicKeyList: {
    0: "0405c5165ecf4757aa0447e90c5679e10876e842ba8a62abdac44e11ceb173f3977e9b0fc6c58705dbdedaee2596032bec8eb5129ac9e4f32d7f5f0fae9ef07b9f",
    1: "04d572bb2c3764ee3458b2e9ae40acc1ecd60ca34c900048ab3d09f3fa08a8104b289bf9d15a8750e4f494a17bbdeec3db554bc2ed029dd6118f4747dcbce6676b",
  },
  quorum: {
    m: 2,
    n: 2,
  },
  multisigAddress: "2N3rukjFGt3dj2bJEAbzJ8DJQZd8moRAf8w",
  currentMultisigTransaction: null,
  redeemScript: null,
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
