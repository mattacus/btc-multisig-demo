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
  currentMultisigTransaction:
    "0100000001fccb18bde8ae85b74e139c6d41a22238cc2f9a97e53b182a8fd88d473e512d4f0000000000ffffffff0288130000000000001976a91484f8e08b00d6bb2cc2f419ea6bd598b68dcbced088acb91200000000000017a91474710300fb1291ba7c89d9545dfee3981dd5ceb98700000000",
  redeemScript: null,
  sigHashList: [
    "47b3f13485211cd8ac866381ad3912b47c6797047a17ddd76885615d5030004d",
  ],
  signatures: {
    0: {
      r: "70eb985fccc1159e22c95106f38d4cd23fd374b6a288c2323b1b38f47addb767",
      s: "3c624fde823df447c627a26b3b6532f7e796b5fc6a24f5565e1484f871c7d04f",
    },
    1: {
      r: "8e5d6567a354bcf2b784cf652e3ef4c49e9e3acc877236be6aba04ae7669624a",
      s: "4ecc74bb2b345517443134e8208b5ba50a95e9b3771076324c53ceea579b8708",
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
