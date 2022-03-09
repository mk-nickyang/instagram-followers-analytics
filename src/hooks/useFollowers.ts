import useSWR from 'swr';

import { fetcher } from '_utils';
import type { FollowerInfo } from '_types';

const useFollowers = () => {
  const { data, error } = useSWR<FollowerInfo[]>('/api/followers', fetcher);

  return {
    followers: data,
    isLoading: !error && !data,
    error: error,
  };
};

export default useFollowers;
