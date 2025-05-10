import type { NextApiRequest, NextApiResponse } from 'next';

type HealthResponse = {
  status: string;
  timestamp: string;
  version: string;
  environment: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthResponse>
) {
  // When statically exported, this will be a fixed value
  const version = '0.1.0';
  const env = process.env.NODE_ENV || 'production';
  
  // Static timestamp for export
  const timestamp = new Date().toISOString();
  
  res.status(200).json({
    status: 'ok',
    timestamp: timestamp,
    version: version,
    environment: env
  });
} 