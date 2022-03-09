import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

import type { FollowerInfo } from '_types';

const getNumberOfFollowersFromPage = async (
  page: puppeteer.Page,
): Promise<number> => {
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

const getUsernamesFromFollowersList = async (page: puppeteer.Page) => {
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

const loadFullFollowersList = async (
  page: puppeteer.Page,
  totalNumberOfFollowers: number,
): Promise<boolean> => {
  try {
    // Get the current list length
    const currentFollowersListLength = await page.evaluate(
      () =>
        document.querySelectorAll('div[aria-label="Followers"] ul li').length,
    );
    console.log('currentFollowersListLength', currentFollowersListLength);
    // Load more if current list length < full list length
    if (currentFollowersListLength < totalNumberOfFollowers) {
      console.log('load more');
      // Scroll list to bottom to load more
      await page.evaluate(() => {
        const followersListContainer = document.querySelector(
          'div[aria-label="Followers"] > div > div > div:nth-child(2)',
        );
        if (followersListContainer) {
          followersListContainer.scrollTop =
            followersListContainer.scrollHeight;
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
      return loadFullFollowersList(page, totalNumberOfFollowers);
    }

    return Promise.resolve(true);
  } catch (error) {
    console.log(error);
    return Promise.resolve(false);
  }
};

const getFollowersFromInstagram = async (): Promise<FollowerInfo[]> => {
  const followersInfo: FollowerInfo[] = [];

  // Init puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // Go to Instagram
  await page.goto('https://www.instagram.com/');
  // Wait for login form load
  await page.waitForSelector('input[name="username"]');
  // Enter test Instagram account email
  await page.type(
    'input[name="username"]',
    'instagram.followers.analytics@gmail.com',
  );
  // Enter test Instagram account password
  await page.type('input[name="password"]', 'FtIw6hropMB1');
  // Click login button
  await page.click('button[type="submit"]');
  // Wait for login success redirect
  await page.waitForNavigation({
    waitUntil: 'networkidle2',
  });
  // Go to profile
  await page.goto('https://www.instagram.com/singsingtime/');
  // Get number of followers
  const followers: number = await getNumberOfFollowersFromPage(page);
  if (followers > 0) {
    // Open followers list
    await page.click("a[href*='/followers']");
    await page.waitForSelector('div[aria-label="Followers"] ul li');
    // Get the followers list
    await loadFullFollowersList(page, followers);
    const followerUsernames = await getUsernamesFromFollowersList(page);
    console.log('followerUsernames length', followerUsernames.length);
    // Get each follower's profile info
    for (const followerUsername of followerUsernames) {
      const profilePage = await browser.newPage();
      try {
        // Go to profile page
        await profilePage.goto(
          `https://www.instagram.com/${followerUsername}/`,
        );
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
        console.log(error);
        // Close page
        await profilePage.close();
        continue;
      }
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
  const followersInfo = await getFollowersFromInstagram();
  console.log('followersInfo', followersInfo);
  res.status(200).json(followersInfo);
};

export default handler;
