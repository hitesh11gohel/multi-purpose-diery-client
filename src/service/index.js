export const signIn = `${process.env.REACT_APP_BASE_URL}/api/auth/login`;
export const signOut = `${process.env.REACT_APP_BASE_URL}/api/auth/logout`;
export const signUp = `${process.env.REACT_APP_BASE_URL}/api/users/add`;
export const updateUserInfo = `${process.env.REACT_APP_BASE_URL}/api/users/update`;

// Expenses API
export const getExpenses = `${process.env.REACT_APP_BASE_URL}/api/expense/get-all`;
export const getExpense = `${process.env.REACT_APP_BASE_URL}/api/expense/get`;
export const deleteExpense = `${process.env.REACT_APP_BASE_URL}/api/expense/delete`;
export const addExpense = `${process.env.REACT_APP_BASE_URL}/api/expense/add`;
export const updateExpense = `${process.env.REACT_APP_BASE_URL}/api/expense/update`;
