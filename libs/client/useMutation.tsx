import { useState } from 'react';

interface UseMutationState {
  loading: boolean;
  data?: object;
  error?: object;
}

interface IUseState {
  loading: boolean;
  data: undefined | any;
  error: undefined | any;
}

type UseMutationResult = [(data: any) => void, UseMutationState];

export default function useMutation(url: string): UseMutationResult {
  // const [loading, setLoaing] = useState(false);
  // const [data, setData] = useState<undefined | any>(undefined);
  // const [error, setError] = useState<undefined | any>(undefined);

  const [state, setState] = useState<IUseState>({
    loading: false,
    data: undefined,
    error: undefined,
  });

  function mutation(data: any) {
    setState({
      ...state,
      loading: true,
    });
    // setLoaing(true);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((response) => response.json().catch(() => {}))
      .then((json) =>
        setState({
          ...state,
          data: json,
        })
      )
      .catch((error) =>
        setState({
          ...state,
          error,
        })
      )
      .finally(() =>
        setState({
          ...state,
          loading: false,
        })
      );

    // .then((json) => setData(json))
    // .catch((error) => setError(error))
    // .finally(() => setLoaing(false));
  }
  return [mutation, { loading: false, data: undefined, error: undefined }];
}
