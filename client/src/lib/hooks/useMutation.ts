import { useState } from "react";
import { server } from "../api/server";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  hasError: boolean;
}

type MutationTuple<TData, TVariables> = [
  (variables?: TVariables | undefined) => Promise<void>,
  State<TData>
];

export const useMutation = <TData = any, TVariables = any>(
  query: string
): MutationTuple<TData, TVariables> => {
  const [state, setState] = useState<State<TData>>({
    data: null,
    loading: false,
    hasError: false,
  });

  const fetch = async (variables?: TVariables) => {
    try {
      setState({ loading: true, hasError: false, data: null });
      const { data, errors } = await server.fetch<TData, TVariables>({
        query,
        variables,
      });

      if (errors?.length) {
        throw new Error(errors[0].message);
      }

      setState({ data, loading: false, hasError: false });
    } catch (e) {
      setState({ loading: false, hasError: true, data: null });
      throw console.error(e);
    }
  };

  return [fetch, state];
};
