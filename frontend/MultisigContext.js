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
    0: "0405c5165ecf4757aa0447e90c5679e10876e842ba8a62abdac44e11ceb173f3977e9b0fc6c58705dbdedaee2596032bec8eb5129ac9e4f32d7f5f0fae9ef07b9f",
    1: "04d572bb2c3764ee3458b2e9ae40acc1ecd60ca34c900048ab3d09f3fa08a8104b289bf9d15a8750e4f494a17bbdeec3db554bc2ed029dd6118f4747dcbce6676b",
  },
  quorum: {
    m: 2,
    n: 2,
  },
  multisigAddress: "2N3rukjFGt3dj2bJEAbzJ8DJQZd8moRAf8w",
  currentMultisigTransaction:
    "010000000121bb7f820f8ecadc70a8016c0eab8f48983c27f5cf23f3f3da4c80b38684253d0000000000ffffffff0288130000000000001976a91484f8e08b00d6bb2cc2f419ea6bd598b68dcbced088acf9ae00000000000017a91474710300fb1291ba7c89d9545dfee3981dd5ceb98700000000",
  redeemScript:
    "52410405c5165ecf4757aa0447e90c5679e10876e842ba8a62abdac44e11ceb173f3977e9b0fc6c58705dbdedaee2596032bec8eb5129ac9e4f32d7f5f0fae9ef07b9f4104d572bb2c3764ee3458b2e9ae40acc1ecd60ca34c900048ab3d09f3fa08a8104b289bf9d15a8750e4f494a17bbdeec3db554bc2ed029dd6118f4747dcbce6676b52ae",
  sigHashList: [
    "7cd0cf81961a527d58df49204af1dbfb003c4a4de5b4636a0b36ff3712c466d3",
  ],
  signatures: {
    0: {
      r: "db0d2c7b4dfb78d1fee45cbf689591e750dbb3633e071f6269d27a5fabce3358",
      s: "6a1fe891e6e5a5be98ce21e84c432b6d541402d2164e6557fd7eedcb1f7dc0e1",
    },
    1: {
      r: "00e3f486da8160b8e8c71c68c3a93dedb85957a994fa85da4befc84d68a9ca1e",
      s: "118ddfa5583480968c0276b1e4f369ffc3d2cde81c19842a1436f3e5e7bc1d2d",
    },
  },
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
