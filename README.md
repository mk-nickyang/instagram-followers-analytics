## 💡 Idea

I want to find out 'Which of my Instagram followers, has the most followers' for my Instagram business account, so one day I can probably reach out to the person for marketing purpose ¯\_(ツ)\_/¯

But Instagram makes it really hard, unless we use some third party tools. So I was just thinking how hard it would be to build one.

## 🚀 Quick Start

1. Install dependencies

   ```bash
   yarn install
   ```

1. Run the development server

   ```bash
   yarn dev
   ```

1. Type your Instagram username and hit Enter and

   <img src="loading_time.jpeg" width="240"/>

1. Got followers data 🥳

## 🤨 Known issues and TODO list

- [ ] Deploy it to a NodeJS server
- [ ] Getting timeout error sometimes when navigating to Instagram in Puppeteer
- [ ] It's really slow if account has over 200 followers (Doing 10 Instagram API calls each time, was trying to avoid bombarding the Instagram API too hard, in case the IP got blocked)
- [ ] Only works for public profile (unless you add )

## ⛴ Deploy

TODO
