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
    const { title, type, planning } = req.body;

    // 设置响应为流式
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 构建提示词
    const prompt = `你是一个专业的全栈开发工程师，现在需要你为一个软件项目编写完整的代码。

项目标题：${title}
软件类型：${type === 'gui' ? '图形化软件' : '后端软件'}

项目规划内容如下：
${planning}

请根据以上规划，编写完整的项目代码。要求：
1. 代码结构清晰，包含必要的注释
2. 实现规划中提到的所有主要功能
3. 代码行数不少于1000行
4. ${type === 'gui' ? `
   - 使用 Next.js 框架, yarn 包管理
   - 实现美观的用户界面
   - 添加适当的交互动画
   - 使用虚拟数据作为演示
   - 实现响应式布局
   ` : `
   - 实现完整的后端服务和算法逻辑
   - 包含数据处理和模型训练代码
   - 添加必要的测试用例
   - 实现错误处理和日志记录
   `}
5. 代码符合最佳实践和设计模式
6. 确保代码可以直接运行
7. 尽可能多的代码行数，能写的逻辑优先重写完整逻辑，少用现成的包
8. 请使用 Markdown 格式输出，使用代码块包裹代码，代码快第一行说明该文件位置和名称。
9. 个实现每个文件的完整代码，不要有任何省略。`;

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

    // 检查代码长度，如果不足则继续生成
    const continuePrompt = `
请继续完善和扩展代码，添加更多功能和细节。要求：
1. 添加更多的组件和工具函数
2. 增加错误处理和边界情况
3. 添加更多的注释和文档字符串
4. 实现更多的辅助功能
5. 添加单元测试代码

请继续使用 Markdown 格式输出，保持代码风格一致。`;

    const continueStream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: '...' }, // 这里应该是之前生成的代码
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
    console.error('代码生成失败:', error);
    // 如果流已经开始，发送错误消息
    if (res.writable) {
      res.write('\n\n生成失败，请重试');
      res.end();
    } else {
      res.status(500).json({ error: '代码生成失败' });
    }
  }
} 