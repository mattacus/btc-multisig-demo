import React from "react";

const MultisigKeyContext = React.createContext(null);
const MultisigKeyDispatchContext = React.createContext(null);

const initialState = {
  publicKeyList: {},
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
    default:
      return state;
  }
};

export const MultisigKeyContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

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
