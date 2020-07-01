import { useReducer } from "react";
import { server } from "../api/server";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  hasError: boolean;
}

type Action<TData> =
  | { type: "FETCH" }
  | { type: "FETCH_SUCCESS"; payload: TData }
  | { type: "FETCH_ERROR" };

type MutationTuple<TData, TVariables> = [
  (variables?: TVariables | undefined) => Promise<void>,
  State<TData>
];

const reducer = <TData>() => (
  state: State<TData>,
  action: Action<TData>
): State<TData> => {
  switch (action.type) {
    case "FETCH":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { data: action.payload, loading: false, hasError: false };
    case "FETCH_ERROR":
      return { ...state, loading: false, hasError: true };
    default:
      throw new Error();
  }
};

export const useMutation = <TData = any, TVariables = any>(
  query: string
): MutationTuple<TData, TVariables> => {
  const fetchReducer = reducer<TData>();
  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: true,
    hasError: false,
  });
  const fetch = async (variables?: TVariables) => {
    try {
      dispatch({ type: "FETCH" });
      const { data, errors } = await server.fetch<TData, TVariables>({
        query,
        variables,
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (e) {
      dispatch({ type: "FETCH_ERROR" });
      throw console.error(e);
    }
  };

  return [fetch, state];
};
