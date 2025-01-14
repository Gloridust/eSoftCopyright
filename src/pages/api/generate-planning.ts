import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

// 初始化 OpenAI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  try {
    const { title, type } = req.body;

    // 设置响应为流式
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 构建提示词
    const prompt = `你是一个资深的软件架构师，现在需要你为一个软件项目进行详细的规划。

项目标题是："${title}"
软件类型是：${type === 'gui' ? '图形化软件（包括APP、Web网站等交互式应用）' : '后端软件（后端服务、算法软件、机器学习等）'}

请你仔细思考并规划以下内容：
1. 分析这个标题可能涉及的具体功能和业务场景
2. 选择最适合的编程语言和技术栈
3. 确定需要使用的框架和库
4. 设计系统的主要模块和它们之间的关系
5. 如果是图形化软件，详细设计UI界面和交互流程
6. 如果是后端软件，详细设计API接口和数据处理流程
7. 考虑可能需要的算法或机器学习模型

请用详细的文字描述你的规划，确保内容充实且专业。使用 Markdown 格式输出，包含适当的标题、列表和代码块。`;

    // 创建流式响应
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    // 逐块发送响应
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // 发送数据块
        res.write(content);
      }
    }

    res.end();
  } catch (error) {
    console.error('项目规划生成失败:', error);
    // 如果流已经开始，发送错误消息
    if (res.writable) {
      res.write('\n\n生成失败，请重试');
      res.end();
    } else {
      res.status(500).json({ error: '项目规划生成失败' });
    }
  }
} 