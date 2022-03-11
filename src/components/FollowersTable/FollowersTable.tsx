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
  Avatar,
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
          {/* <Th></Th> */}
          <Th>Username</Th>
          <Th>Full Name</Th>
          <Th>Follower Count</Th>
          <Th>Following Count</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((follower) => (
          <Tr key={follower.id}>
            {/* <Td>
              <Avatar src={follower.profile_pic_url} />
            </Td> */}
            <Td>{follower.username}</Td>
            <Td>{follower.full_name}</Td>
            <Td>{follower.follower_count}</Td>
            <Td>{follower.following_count}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default FollowersTable;
