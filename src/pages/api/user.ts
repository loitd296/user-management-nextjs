
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const response = await fetch('http://localhost:4000/user');
  const data = await response.json();
  res.status(200).json(data);
};
