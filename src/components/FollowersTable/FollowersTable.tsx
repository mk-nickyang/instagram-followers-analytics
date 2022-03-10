import React from 'react';
import {
  Center,
  Alert,
  AlertIcon,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';

import type { FollowerInfo } from '_types';

type FollowersTableProps = {
  isLoading: boolean;
  isError: boolean;
  data: FollowerInfo[];
};

const FollowersTable: React.FC<FollowersTableProps> = ({
  isLoading,
  isError,
  data,
}) => {
  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  if (isError)
    return (
      <Alert status="error">
        <AlertIcon />
        There was an error fetching your followers
      </Alert>
    );

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Username</Th>
          <Th>Follower Count</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((follower) => (
          <Tr key={follower.username}>
            <Td>{follower.username}</Td>
            <Td>{follower.follower_count}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default FollowersTable;
