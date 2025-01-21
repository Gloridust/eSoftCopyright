import OpenAI from 'openai';

// 检查必要的环境变量
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

// 清理标题文本
function sanitizeTitle(text: string): string {
  return text
    // 移除 markdown 格式
    .replace(/[#*`_~>]/g, '')
    // 移除所有标点符号
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
    // 移除多余空格
    .trim()
    // 限制长度
    .slice(0, 24);
}

export async function generateTitle(prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: '你是一个软件著作权作品命名专家。根据用户的描述，生成一个专业的软件名称，不超过24个字。形如"基于CNN的页岩孔隙研究系统"。你需要思考其相关的尖端技术或算法，并在名称中体现具体的技术算法名称。只返回名称，不要其他解释和任何其余符号。'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  const rawTitle = completion.choices[0].message.content || '';
  
  // 清理并验证标题
  const cleanTitle = sanitizeTitle(rawTitle);
  
  // 确保标题以"系统"、"平台"或"软件"结尾
  const suffixes = ['系统', '平台', '软件'];
  if (!suffixes.some(suffix => cleanTitle.endsWith(suffix))) {
    return cleanTitle + '系统';
  }

  return cleanTitle;
}

export default openai; 