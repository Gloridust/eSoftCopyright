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
    const { title, type, planning, code } = req.body;

    // 设置响应为流式
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 构建提示词
    const prompt = `你是一个专业的技术文档撰写专家，现在需要你为一个软件项目编写详细的说明文档，用于软件著作权申请。
    现在，你需要根据所有代码（包括前端、后端等）写一篇说明文档，用于申请软著。你需要详细写出所有页面/模块说明、所用技术、技术优点等，尽可能详细。用自然语言文段描述（不要分点作答）。

项目标题：${title}
软件类型：${type === 'gui' ? '图形化软件' : '后端软件'}

项目规划内容：
${planning}

项目代码：
${code}

请根据以上内容，编写一份详尽的软件说明文档。要求：
1. 文档结构清晰，语言专业准确
2. 详细说明软件的功能特点、技术特点、创新点
3. 描述系统架构、模块组成、数据流程
4. 重点突出软件的技术先进性和实用价值
5. 说明所使用的关键技术、算法、框架，在必要的地方使用Mermaid绘制流程图，说明总体和局部代码运行原理
6. 描述用户界面和交互流程（如果是图形化软件）
7. 说明系统的性能、安全性、可扩展性等特点
8. 文档字数不少于6000字
9. 使用自然语言段落描述，避免过多的列表和标题
10. 内容要充实，避免空洞和重复

输出完整的文档内容，不要有任何省略。
请使用 Markdown 格式输出，合理使用标题、段落、列表和代码块，使文档结构清晰易读。
请用流畅的文字，完整地描述这个软件系统。注意突出其技术创新点和应用价值。
直接开始输出文档内容，不要有任何无关语句。`;

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

    // 如果文档不够长，继续生成
    const continuePrompt = `
请继续扩展文档内容，补充更多细节。重点关注：
1. 技术实现细节
2. 系统优化措施
3. 安全性设计
4. 扩展性考虑
5. 实际应用场景

请继续使用 Markdown 格式输出，确保行文流畅，与前文自然衔接。
文档尽量以自然语言段落的形式输出，避免分点。
直接开始输出项目文档内容，不用输出其他无关语句。输出完整的文档内容，不要有任何省略。`;

    const continueStream = await openai.chat.completions.create({
      model: 'moonshot-v1-128k',
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: '...' }, // 这里应该是之前生成的文档
        { role: 'user', content: continuePrompt }
      ],
      stream: true,
    });

    // 继续发送响应
    for await (const chunk of continueStream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        // 发送数据块
        res.write(content);
      }
    }

    res.end();
  } catch (error) {
    console.error('文档生成失败:', error);
    // 如果流已经开始，发送错误消息
    if (res.writable) {
      res.write('\n\n生成失败，请重试');
      res.end();
    } else {
      res.status(500).json({ error: '文档生成失败' });
    }
  }
} 