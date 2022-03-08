import useSWR from 'swr';

import { fetcher } from '_utils';

const useFollowers = () => {
  const { data, error } = useSWR('/api/followers', fetcher);

  return {
    followers: data,
    isLoading: !error && !data,
    error: error,
  };
};

export default useFollowers;
