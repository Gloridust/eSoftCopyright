import type { NextApiRequest, NextApiResponse } from 'next';
import { generateTitle } from '@/lib/openai';

type ResponseData = {
  title?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: '请提供有效的描述文本' });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('未配置 OpenAI API 密钥，请联系管理员');
    }

    const title = await generateTitle(prompt);
    res.status(200).json({ title });
  } catch (error) {
    console.error('Error in generate-title API:', error);
    
    // 处理特定类型的错误
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return res.status(500).json({ error: 'API 密钥无效，请联系管理员' });
      }
      if (error.message.includes('Rate limit')) {
        return res.status(429).json({ error: '请求过于频繁，请稍后再试' });
      }
      return res.status(500).json({ error: error.message });
    }
    
    res.status(500).json({ error: '生成标题时出现错误，请稍后重试' });
  }
} 