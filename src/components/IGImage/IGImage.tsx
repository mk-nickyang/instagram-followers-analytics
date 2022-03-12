import React from 'react';
import { Avatar, SkeletonCircle } from '@chakra-ui/react';
import useSWRImmutable from 'swr/immutable';
import queryString from 'query-string';

type IGImageProps = { imgURL: string };

const IGImage: React.FC<IGImageProps> = ({ imgURL }) => {
  const { data, error } = useSWRImmutable<string>(
    imgURL ? `/api/ig-image?${queryString.stringify({ imgURL })}` : null,
  );

  if (error) {
    return <Avatar />;
  }

  if (!data) {
    return <SkeletonCircle />;
  }

  return <Avatar src={`data:image/jpeg;base64,${data}`} />;
};

export default IGImage;
