import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';
import axios, { AxiosRequestHeaders } from 'axios';
import chunk from 'lodash/chunk';

import type {
  FollowerInfo,
  IGFollowersResponseData,
  IGUserInfoResponseData,
  IGUsernameResponseData,
} from '_types';

const getFollowersFromInstagram = async (
  username: string,
): Promise<FollowerInfo[]> => {
  // Init puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Set random UA
  const userAgent = new UserAgent().toString();
  await page.setUserAgent(userAgent);
  // Go to Instagram
  await page.goto('https://www.instagram.com/');
  console.log('go to instagram');

  // Wait for login form load
  await page.waitForSelector('input[name="username"]');
  // Enter test Instagram account email
  await page.type(
    'input[name="username"]',
    process.env.TEST_INSTAGRAM_ACCOUNT_EMAIL!,
  );
  // Enter test Instagram account password
  await page.type(
    'input[name="password"]',
    process.env.TEST_INSTAGRAM_ACCOUNT_PASSWORD!,
  );
  // Click login button
  await page.click('button[type="submit"]');
  // Wait for login success redirect
  await page.waitForNavigation();
  console.log('login success');

  // Get Instagram API request headers
  const igRquest = await page.waitForRequest(
    (request) =>
      request.url().includes('i.instagram.com') && request.method() === 'GET',
  );
  const requestHeaders = igRquest.headers();
  const igAppId = requestHeaders['x-ig-app-id'];
  // Get cookies
  const cookies = await page.cookies();
  const cookieString = cookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
  // Get user id and number of followers
  const { data: igUserData } = await axios.get<IGUsernameResponseData>(
    `https://www.instagram.com/${username}/?__a=1`,
    { headers: { userAgent, cookie: cookieString } },
  );
  const userId = igUserData.graphql.user.id;
  const numberOfFollowers = igUserData.graphql.user.edge_followed_by.count;
  // Set Instagram API headers
  const igRequestHeaders: AxiosRequestHeaders = {
    userAgent,
    'x-ig-app-id': igAppId,
    cookie: cookieString,
  };
  // Use Instagram API to fetch followers
  const { data: igFollowersData } = await axios.get<IGFollowersResponseData>(
    `https://i.instagram.com/api/v1/friendships/${userId}/followers/`,
    {
      headers: igRequestHeaders,
      params: { count: numberOfFollowers },
    },
  );
  const followers = igFollowersData.users;
  console.log(`found ${followers.length} followers`);
  // Use Instagram API to fetch each follower's follower count
  // Chunk followers list into small ones
  const chunkedFollowersList = chunk(followers, 10);

  let followersInfo: FollowerInfo[] = [];

  for (const followersList of chunkedFollowersList) {
    const followersInfoChunk: FollowerInfo[] = await Promise.all(
      followersList.map(async (follower) => {
        try {
          const { data: userInfoData } =
            await axios.get<IGUserInfoResponseData>(
              `https://i.instagram.com/api/v1/users/${follower.pk}/info/`,
              {
                headers: igRequestHeaders,
              },
            );
          return {
            id: userInfoData.user.pk,
            username: userInfoData.user.username,
            full_name: userInfoData.user.full_name,
            is_private: userInfoData.user.is_private,
            profile_pic_url: userInfoData.user.profile_pic_url,
            follower_count: userInfoData.user.follower_count,
            following_count: userInfoData.user.following_count,
            media_count: userInfoData.user.media_count,
            is_business: userInfoData.user.is_business,
          };
        } catch (error) {
          console.log('fetch user info failed', follower, error);
          return {
            id: follower.pk,
            username: follower.username,
            full_name: follower.full_name,
            is_private: follower.is_private,
            profile_pic_url: follower.profile_pic_url,
          };
        }
      }),
    );

    followersInfo = [...followersInfo, ...followersInfoChunk];
    console.log(`fetched ${followersInfo.length} more followers info`);
  }

  // Close browser
  await browser.close();

  console.log(`return ${followersInfo.length} followers info`);

  return followersInfo;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<FollowerInfo[]>,
) => {
  const { username } = req.query;

  if (username && typeof username === 'string') {
    try {
      const followersInfo = await getFollowersFromInstagram(username);
      res.status(200).json(followersInfo);
    } catch (error) {
      console.log(error);
      res.status(500).json([]);
    }
  } else {
    res.status(400).json([]);
  }
};

export default handler;
