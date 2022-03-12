import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { imgURL } = req.query;

  if (imgURL && typeof imgURL === 'string') {
    try {
      const { data } = await axios.get<Buffer>(imgURL, {
        responseType: 'arraybuffer',
      });
      const imgBase64 = Buffer.from(data).toString('base64');
      res.send(imgBase64);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: `Fail to download image ${imgURL}` });
    }
  } else {
    res.status(400).send({ error: 'Missing imgURL' });
  }
};

export default handler;
