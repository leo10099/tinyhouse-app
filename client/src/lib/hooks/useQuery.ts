import { useCallback, useEffect, useState } from "react";
import { server } from "../api/server";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  hasError: boolean;
}

interface QueryResult<TData> extends State<TData> {
  refetch: () => void;
}

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
  const [state, setState] = useState<State<TData>>({
    data: null,
    loading: true,
    hasError: false,
  });

  const fetch = useCallback(() => {
    const fetchApi = async () => {
      try {
        setState({ data: null, loading: true, hasError: false });
        const { data, errors } = await server.fetch<TData>({ query });
        if (errors?.length) {
          throw new Error(errors[0].message);
        }
        setState({ data, loading: false, hasError: false });
      } catch (e) {
        setState({ data: null, loading: false, hasError: true });
        throw console.error(e);
      }
    };

    fetchApi();
  }, [query]);

  useEffect(() => {
    fetch();
  }, [fetch, query]);

  return { ...state, refetch: fetch };
};
