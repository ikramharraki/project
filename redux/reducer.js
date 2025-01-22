// Initialisation de l'état global
const initialState = {
  transactions: [],
};

// Reducer pour gérer les transactions
const transactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          (txn) => txn.id !== action.payload
        ),
      };
    case 'CLEAR_TRANSACTIONS':
      return {
        ...state,
        transactions: [],
      };
    default:
      return state; // Retourne l'état actuel si l'action est inconnue
  }
};

export default transactionReducer;
