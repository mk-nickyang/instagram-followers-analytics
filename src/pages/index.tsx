import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useRef, KeyboardEvent } from 'react';
import {
  Container,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import axios from 'axios';

import { FollowersTable, IGImage } from '_components';
import type { FollowerInfo } from '_types';

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [followers, setFollowers] = useState<FollowerInfo[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const insUsernameInput = useRef<HTMLInputElement | null>(null);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchClick();
    }
  };

  const onSearchClick = async () => {
    const insUsername = insUsernameInput.current?.value;
    if (insUsername) {
      setIsLoading(true);
      setIsError(false);
      try {
        const { data } = await axios.get<FollowerInfo[]>(
          `/api/followers?username=${insUsername}`,
        );
        setFollowers(data);
      } catch (error) {
        console.log(error);
        setIsError(true);
      }
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Instagram Followers Analytics</title>
        <meta
          name="description"
          content="Find out your most-followed followers on Instagram"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container py={10}>
          <Stack spacing={5}>
            <Heading size="lg">Instagram Followers Analytics</Heading>

            <InputGroup>
              <Input
                ref={insUsernameInput}
                placeholder="Enter your Instagram username, e.g. (singsingtime)"
                onKeyDown={onInputKeyDown}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Search followers"
                  icon={<SearchIcon />}
                  onClick={onSearchClick}
                />
              </InputRightElement>
            </InputGroup>

            <FollowersTable
              isLoading={isLoading}
              isError={isError}
              data={followers}
            />
          </Stack>
        </Container>
      </main>
    </>
  );
};

export default Home;
