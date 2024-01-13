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
    0: "0405c5165ecf4757aa0447e90c5679e10876e842ba8a62abdac44e11ceb173f3977e9b0fc6c58705dbdedaee2596032bec8eb5129ac9e4f32d7f5f0fae9ef07b9f",
    1: "04d572bb2c3764ee3458b2e9ae40acc1ecd60ca34c900048ab3d09f3fa08a8104b289bf9d15a8750e4f494a17bbdeec3db554bc2ed029dd6118f4747dcbce6676b",
  },
  quorum: {
    m: 2,
    n: 2,
  },
  multisigAddress: "2N3rukjFGt3dj2bJEAbzJ8DJQZd8moRAf8w",
  currentMultisigTransaction:
    "0100000001fccb18bde8ae85b74e139c6d41a22238cc2f9a97e53b182a8fd88d473e512d4f0000000000ffffffff0288130000000000001976a91484f8e08b00d6bb2cc2f419ea6bd598b68dcbced088acb91200000000000017a91474710300fb1291ba7c89d9545dfee3981dd5ceb98700000000",
  sigHashList: [
    "47b3f13485211cd8ac866381ad3912b47c6797047a17ddd76885615d5030004d",
  ],
  signatures: {
    0: {
      r: "116b86cba8b5d0314511cf10ca0dbb6f0b710c0e7c060b161b6eeddfdb5874c0",
      s: "7a98330b12164c2cc8c15cad447daf75eb389ffd2a288b89d2f37de7379835c1",
    },
    1: {
      r: "bfae752b70cc95c7fb9c0394a0ef1ecc58e862e2a53ff09050b86e2e6ef79d40",
      s: "404affc376428a4550c9e7167f86bfdde07a3cc8631b3fb5816c770296a53b72",
    },
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
