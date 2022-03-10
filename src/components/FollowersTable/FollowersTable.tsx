import React from 'react';
import useSWR from 'swr';
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

type FollowersTableProps = { insUsername: string };

const FollowersTable: React.FC<FollowersTableProps> = ({ insUsername }) => {
  const { data, error } = useSWR<FollowerInfo[]>(
    insUsername ? `/api/followers?username=${insUsername}` : null,
  );

  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        There was an error fetching your followers
      </Alert>
    );

  if (!data)
    return (
      <Center>
        <Spinner />
      </Center>
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
