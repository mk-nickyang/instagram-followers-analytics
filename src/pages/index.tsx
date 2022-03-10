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

import { FollowersTable } from '_components';

const Home: NextPage = () => {
  const [insUsername, setInsUsername] = useState<string>('');

  const insUsernameInput = useRef<HTMLInputElement | null>(null);

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchClick();
    }
  };

  const onSearchClick = () => {
    const insUsernameInputValue = insUsernameInput.current?.value;
    if (insUsernameInputValue) {
      setInsUsername(insUsernameInputValue);
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

            {insUsername && <FollowersTable insUsername={insUsername} />}
          </Stack>
        </Container>
      </main>
    </>
  );
};

export default Home;
