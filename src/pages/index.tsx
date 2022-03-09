import type { NextPage } from 'next';
import Head from 'next/head';

import { useFollowers } from '_hooks';

const Home: NextPage = () => {
  const { followers, error } = useFollowers();

  if (error) return <div>Failed to load</div>;
  if (!followers) return <div>Loading...</div>;

  console.log(followers);

  return (
    <div>
      <Head>
        <title>Instagram Followers Analytics</title>
        <meta
          name="description"
          content="Find out your most-followed followers on Instagram"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Instagram Followers Analytics</h1>
        <table>
          <tr>
            <th>Username</th>
            <th>Follower Count</th>
          </tr>
          {followers.map((follower) => (
            <tr key={follower.username}>
              <td>{follower.username}</td>
              <td>{follower.follower_count}</td>
            </tr>
          ))}
        </table>
      </main>

      <footer>footer</footer>
    </div>
  );
};

export default Home;
