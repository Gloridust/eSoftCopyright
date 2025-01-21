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

    const systemPrompt = `你是一个专业的全栈开发工程师。你需要根据项目规划编写完整的项目代码。为了后续给该项目申请软著，项目代码一定要详细，按照软著标准写。代码要求：
1. 代码结构清晰，包含必要的注释;
2. 实现规划中提到的所有主要功能;
3. 代码行数不少于1000行;
4. 代码符合最佳实践和设计模式;
5. 确保代码可以直接运行;
6. 尽可能多的代码行数，能写的逻辑优先重写完整逻辑，少用现成的包;
7. 使用 Markdown 格式输出，使用代码块包裹代码，代码块第一行说明该文件位置和名称
8. 提供每个文件的完整代码，不要有任何省略;
9. 优先自己写服务，并且保证代码完整性，不要省略任何代码片段；
10. 设计完整的代码目录结构，比如，在使用 nextjs 时，详细设计 pages 和 components 目录结构，以及next.config.js/tsconfig.json/tailwind.config.js 等所有配置文件；
`;

    const userPrompt = `项目标题：${title}
软件类型：${type === 'gui' ? '图形化软件' : '后端软件'}

项目规划内容如下：
${planning}

${type === 'gui' ? `
技术要求：
- 使用 Next.js 框架, yarn 包管理
- 实现美观的用户界面
- 添加适当的交互动画
- 使用虚拟数据作为演示
- 实现响应式布局
- 为了合理的展示前端 demo 并进行 UI 展示，前端需要你自己生成并填充一些数据
` : `
技术要求：
- 实现完整的后端服务和算法逻辑
- 包含数据处理和模型训练代码
- 添加必要的测试用例
- 实现错误处理和日志记录
`}

请根据以上要求编写完整代码。`;

    // 创建流式响应
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
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

    // 修改继续生成的部分
    const continuationSystemPrompt = `继续完善和扩展已生成的代码。要求：
1. 添加更多的组件和工具函数
2. 增加错误处理和边界情况
3. 添加更多的注释和文档字符串
4. 实现更多的辅助功能
5. 添加单元测试代码
保持代码风格一致，使用 Markdown 格式输出。`;

    const continueStream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: continuationSystemPrompt },
        { role: 'user', content: userPrompt },
        { role: 'assistant', content: '...' }, // 之前生成的代码
        { role: 'user', content: '请继续完善代码' }
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