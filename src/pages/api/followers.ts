import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer, { Page } from 'puppeteer';

import type { FollowerInfo } from '_types';

const setPageUserAgent = async (page: Page) => {
  // set user agent (override the default headless User Agent)
  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4889.0 Safari/537.36',
  );
};

const getNumberOfFollowersFromPage = async (page: Page): Promise<number> => {
  // Wait for profile page header load
  await page.waitForSelector('header section ul > li:nth-child(2) span[title]');
  // Get number of followers
  const followersString = await page.evaluate(() =>
    document
      .querySelector('header section ul > li:nth-child(2) span')
      ?.getAttribute('title'),
  );
  const followers: number = followersString
    ? Number(followersString.replace(/,/g, ''))
    : 0;
  return followers;
};

const getUsernamesFromFollowersList = async (page: Page) => {
  const followerUsernames = await page.evaluate(() => {
    const usernames: string[] = [];
    document
      .querySelectorAll('div[aria-label="Followers"] ul li')
      .forEach((listEle) => {
        const link = listEle.querySelector('a[title]')?.getAttribute('href');
        if (link) {
          const username = link.replace(/\//g, '');
          usernames.push(username);
        }
      });
    return usernames;
  });
  return followerUsernames;
};

const loadFullFollowersList = async (page: Page): Promise<boolean> => {
  try {
    console.log('load more');
    // Scroll list to bottom to load more
    await page.evaluate(() => {
      const followersListContainer = document.querySelector(
        'div[aria-label="Followers"] > div > div > div:nth-child(2)',
      );
      if (followersListContainer) {
        followersListContainer.scrollTop = followersListContainer.scrollHeight;
      }
    });
    // Wait for GET /followers API is called
    try {
      // If /followers API is not called in 3 seconds, it means list is at bottom
      // Although it may not match with the Instagram followers count
      await page.waitForRequest(
        (request) =>
          request.url().includes('/followers') && request.method() === 'GET',
        { timeout: 3000 },
      );
    } catch {
      return Promise.resolve(true);
    }
    // Wait for POST /show_many API is called
    await page.waitForResponse(
      (response) =>
        response.url().includes('/show_many') && response.status() === 200,
    );
    await page.waitForTimeout(1000);
    return loadFullFollowersList(page);
  } catch (error) {
    console.log(error);
    return Promise.resolve(false);
  }
};

const getFollowersFromInstagram = async (
  username: string,
): Promise<FollowerInfo[]> => {
  const followersInfo: FollowerInfo[] = [];

  // Init puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Set page UA
  await setPageUserAgent(page);
  // Remove default timeout
  page.setDefaultNavigationTimeout(0);
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
  await page.waitForNavigation({
    waitUntil: 'networkidle2',
  });
  console.log('login success');
  // Go to profile
  await page.goto(`https://www.instagram.com/${username}/`, {
    waitUntil: 'networkidle2',
  });
  await page.waitForSelector("a[href*='/followers']");
  // Open followers list
  await page.click("a[href*='/followers']");
  try {
    await page.waitForSelector('div[aria-label="Followers"] ul li');
  } catch {
    // No followers
    return [];
  }
  // Get the followers list
  await loadFullFollowersList(page);
  const followerUsernames = await getUsernamesFromFollowersList(page);
  console.log('followerUsernames length', followerUsernames.length);
  // Get each follower's profile info
  for (const followerUsername of followerUsernames) {
    const profilePage = await browser.newPage();
    // Set page UA
    await setPageUserAgent(profilePage);
    try {
      // Go to profile page
      await profilePage.goto(`https://www.instagram.com/${followerUsername}/`);
      // Get number of followers
      const followerCount = await getNumberOfFollowersFromPage(profilePage);
      // Close page
      await profilePage.close();
      // Update followersInfo
      console.log('new follower info added', {
        username: followerUsername,
        follower_count: followerCount,
      });
      followersInfo.push({
        username: followerUsername,
        follower_count: followerCount,
      });
    } catch (error) {
      console.log(`failed to fetch profile from ${followerUsername}`, error);
      // Close page
      await profilePage.close();
      continue;
    }
  }

  // Close browser
  await browser.close();

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
      console.log('followersInfo', followersInfo);
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
