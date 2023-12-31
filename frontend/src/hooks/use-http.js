import { useReducer, useCallback } from "react";

const httpReducer = (state, action) => {
  if (action.type === "SEND") {
    return {
      data: state.data,
      error: undefined,
      status: "pending",
    };
  }
  if (action.type === "SUCCESS") {
    return {
      data: action.responseData,
      error: null,
      status: "completed",
    };
  }
  if (action.type === "ERROR") {
    return {
      isLoading: false,
      data: state.data,
      error: action.error,
    };
  }
  if (action.type === "CLEAR"){
    return {
      isLoading:false,
      data:action.value,
      error:null
    }
  }
};

const useHttp = (requestFunction, initialValue = null) => {
  const [httpState, dispatch] = useReducer(httpReducer, {
    status:  undefined,
    data: initialValue,
    error: undefined,
  });


  const sendRequest = useCallback(async (requestData) => {
    dispatch({ type: "SEND" });
    try {
      const responseData = await requestFunction(requestData);
      dispatch({ type: "SUCCESS", responseData });
    } catch (error) {
      dispatch({
        type:"ERROR",
        error: error.message || "Something went wrong",
        data: null,
      })

    }
  },[requestFunction]);

  const clearRequest = () => {
    dispatch({type:"CLEAR",value: initialValue});
  }

  const handleNotify = (message) => {
  }

  return{
    sendRequest,
    handleNotify,
    clearRequest,
    ...httpState
  }
};


export default useHttp;