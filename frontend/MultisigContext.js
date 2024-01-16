import React from "react";
import { MULTISIG_ADDRESS_TYPES } from "./const";

const MultisigContext = React.createContext(null);
const MultisigDispatchContext = React.createContext(null);

const initialState = {
  multisigAddressType: MULTISIG_ADDRESS_TYPES.p2sh,
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

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_MULTISIG_ADDRESS_TYPE":
      return {
        ...state,
        multisigAddressType: action.payload,
      };
    case "SET_PUBLIC_KEYS":
      return {
        ...state,
        publicKeyList: action.payload,
      };
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
    case "REMOVE_SIGNATURE":
      let newSignatures = { ...state.signatures };
      delete newSignatures[action.payload];
      return {
        ...state,
        signatures: newSignatures,
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
  const [state, dispatch] = React.useReducer(reducer, initialState);

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
