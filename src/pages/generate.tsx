import { useState, useEffect } from 'react';
import { Geist } from "next/font/google";
import SEO from "@/components/SEO";
import ReactMarkdown from 'react-markdown';
import {
  Container,
  Box,
  Typography,
  TextField,
  IconButton,
  alpha,
  useTheme,
  Fade,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';
import {
  AutoFixHigh as MagicIcon,
  Apps as AppsIcon,
  Terminal as TerminalIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const geist = Geist({
  subsets: ["latin"],
});

// 示例标题
const EXAMPLE_TITLES = [
    "基于LSTM的成绩分析系统",
    "基于大数据的财务决策系统",
    "页岩孔隙流体力学模拟系统",
    "智能医疗影像分析系统",
    "工业物联网数据分析平台"
];

// 软件类型选项
const SOFTWARE_TYPES = [
  {
    id: 'gui',
    title: '图形化软件',
    description: '包括APP、Web网站等交互式应用',
    icon: <AppsIcon sx={{ fontSize: 40 }} />,
  },
  {
    id: 'backend',
    title: '后端软件',
    description: '后端服务、算法软件、机器学习等',
    icon: <TerminalIcon sx={{ fontSize: 40 }} />,
  },
];

// 生成状态类型
type GenerationStatus = {
  planning: 'waiting' | 'generating' | 'done';
  code: 'waiting' | 'generating' | 'done';
  doc: 'waiting' | 'generating' | 'done';
};

// 生成内容类型
type GenerationContent = {
  planning: string;
  code: string;
  doc: string;
};

export default function Generate() {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTitleGenerating, setIsTitleGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    details: {
      responseText?: string;
      parseError?: string;
    } | null;
  }>({ message: '', details: null });
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    planning: 'waiting',
    code: 'waiting',
    doc: 'waiting',
  });
  const [generationContent, setGenerationContent] = useState<GenerationContent>({
    planning: '',
    code: '',
    doc: '',
  });

  // 示例标题轮播效果
  useEffect(() => {
    if (title) return; // 如果用户已输入，停止轮播

    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % EXAMPLE_TITLES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [title]);

  // 验证标题
  const validateTitle = (value: string) => {
    if (value.length > 24) {
      setTitleError('标题不能超过24个字');
      return false;
    }
    if (/\s/.test(value)) {
      setTitleError('标题不能包含空格');
      return false;
    }
    if (/[^\u4e00-\u9fa5a-zA-Z0-9]/.test(value)) {
      setTitleError('标题只能包含中文、英文和数字');
      return false;
    }
    setTitleError('');
    return true;
  };

  // 处理标题变化
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setTitle(value);
    validateTitle(value);
  };

  // 处理AI生成标题
  const handleGenerateTitle = async () => {
    if (!aiPrompt.trim()) {
      setGenerateError('请输入软件描述');
      return;
    }

    setIsTitleGenerating(true);
    setGenerateError('');
    setErrorDetails({ message: '', details: null });
    try {
      const response = await fetch('/api/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      let responseText;
      try {
        responseText = await response.text();
        const data = JSON.parse(responseText);
        
        if (!response.ok) {
          throw new Error(data.error || '生成标题失败');
        }

        if (data.title) {
          const isValid = validateTitle(data.title);
          if (isValid) {
            setTitle(data.title);
            setIsAIDialogOpen(false);
            setAiPrompt('');
          } else {
            throw new Error('AI 生成的标题不符合要求，请重试');
          }
        } else {
          throw new Error('未能生成有效的标题');
        }
      } catch (parseError) {
        console.error('解析响应失败:', parseError);
        setErrorDetails({
          message: '解析响应数据失败',
          details: {
            responseText,
            parseError: parseError instanceof Error ? parseError.message : String(parseError)
          }
        });
        throw new Error('解析响应数据失败，点击详情查看具体错误');
      }
    } catch (error) {
      console.error('生成标题失败:', error);
      setGenerateError(error instanceof Error ? error.message : '生成标题失败，请稍后重试');
    } finally {
      setIsTitleGenerating(false);
    }
  };

  // 处理下一步
  const handleNext = () => {
    if (currentStep === 0 && (!title || titleError)) {
      return;
    }
    if (currentStep === 1 && !selectedType) {
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  // 处理上一步
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // 处理完成
  const handleComplete = async () => {
    setIsGenerating(true);
    
    try {
      // 开始项目规划生成
      setGenerationStatus(prev => ({ ...prev, planning: 'generating' }));
      const planningResponse = await fetch('/api/generate-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title,
          type: selectedType 
        }),
      });

      if (!planningResponse.ok) throw new Error('项目规划生成失败');
      
      // 使用 ReadableStream 处理流式响应
      const planningReader = planningResponse.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      
      if (!planningReader) throw new Error('无法读取响应流');

      // 项目规划生成
      while (true) {
        const { done, value } = await planningReader.read();
        if (done) break;
        
        // 直接更新状态，不需要缓存
        setGenerationContent(prev => ({
          ...prev,
          planning: prev.planning + value
        }));
      }
      
      setGenerationStatus(prev => ({ ...prev, planning: 'done' }));

      // 开始代码生成
      setGenerationStatus(prev => ({ ...prev, code: 'generating' }));
      const codeResponse = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title,
          type: selectedType,
          planning: generationContent.planning
        }),
      });

      if (!codeResponse.ok) throw new Error('代码生成失败');
      
      // 使用 ReadableStream 处理流式响应
      const codeReader = codeResponse.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      
      if (!codeReader) throw new Error('无法读取响应流');

      // 代码生成
      while (true) {
        const { done, value } = await codeReader.read();
        if (done) break;
        
        // 直接更新状态，不需要缓存
        setGenerationContent(prev => ({
          ...prev,
          code: prev.code + value
        }));
      }
      
      setGenerationStatus(prev => ({ ...prev, code: 'done' }));

      // 开始文档生成
      setGenerationStatus(prev => ({ ...prev, doc: 'generating' }));
      const docResponse = await fetch('/api/generate-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title,
          type: selectedType,
          planning: generationContent.planning,
          code: generationContent.code
        }),
      });

      if (!docResponse.ok) throw new Error('文档生成失败');
      
      // 使用 ReadableStream 处理流式响应
      const docReader = docResponse.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();
      
      if (!docReader) throw new Error('无法读取响应流');

      // 文档生成
      while (true) {
        const { done, value } = await docReader.read();
        if (done) break;
        
        // 直接更新状态，不需要缓存
        setGenerationContent(prev => ({
          ...prev,
          doc: prev.doc + value
        }));
      }
      
      setGenerationStatus(prev => ({ ...prev, doc: 'done' }));

    } catch (error) {
      console.error('生成失败:', error);
      // TODO: 显示错误提示
    }
  };

  // 生成状态展示组件
  const GenerationStatusBox = ({ 
    title, 
    status, 
    content 
  }: { 
    title: string; 
    status: 'waiting' | 'generating' | 'done'; 
    content: string;
  }) => {
    const theme = useTheme();
    
    return (
      <Card 
        elevation={0}
        sx={{ 
          height: '100%',
          maxHeight: '400px', // 限制最大高度
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.paper',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 2,
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ mr: 2, fontWeight: 600 }}>
                {title}
              </Typography>
              {status === 'waiting' && (
                <CircularProgress size={14} sx={{ opacity: 0.5 }} />
              )}
              {status === 'generating' && (
                <CircularProgress size={14} />
              )}
              {status === 'done' && (
                <Box
                  component="span"
                  sx={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    display: 'inline-block',
                  }}
                />
              )}
            </Box>
          }
          sx={{
            p: 1.5,
            bgcolor: alpha(theme.palette.background.paper, 0.6),
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        />
        <CardContent 
          sx={{ 
            flex: 1,
            p: '0 !important',
            minHeight: 0,
            maxHeight: 'calc(100% - 48px)',
            overflow: 'auto',
          }}
        >
          {(status === 'generating' || status === 'done') && content && (
            <Box
              sx={{
                height: '100%',
                maxHeight: 'calc(400px - 48px)', // 减去标题栏高度
                p: 2,
                fontSize: '0.875rem',
                '& .markdown-body': {
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                  wordWrap: 'break-word',
                  '& > :first-child': {
                    mt: 0,
                  },
                  '& > :last-child': {
                    mb: 0,
                  },
                },
                '& pre': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  p: 1.5,
                  borderRadius: 1,
                  overflow: 'auto',
                  fontSize: '0.8125rem',
                  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                },
                '& code': {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  p: '0.2em 0.4em',
                  borderRadius: 0.5,
                  fontSize: '85%',
                  fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  wordBreak: 'break-word',
                },
                '& h1, & h2, & h3, & h4, & h5, & h6': {
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  lineHeight: 1.25,
                  mt: 2,
                  mb: 1,
                },
                '& h1': { fontSize: '1.5rem', pb: 0.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}` },
                '& h2': { fontSize: '1.25rem', pb: 0.5, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}` },
                '& h3': { fontSize: '1.125rem' },
                '& h4': { fontSize: '1rem' },
                '& h5': { fontSize: '0.875rem' },
                '& h6': { fontSize: '0.85rem', color: theme.palette.text.secondary },
                '& p': {
                  mt: 0,
                  mb: 2,
                  color: theme.palette.text.secondary,
                },
                '& ul, & ol': {
                  mt: 0,
                  mb: 2,
                  pl: 2,
                },
                '& li': {
                  mb: 0.5,
                  '& > p': {
                    mb: 1,
                  },
                  '& > ul, & > ol': {
                    mb: 1,
                  },
                },
                '& hr': {
                  height: 1,
                  my: 2,
                  border: 'none',
                  bgcolor: theme.palette.divider,
                },
                '& blockquote': {
                  m: 0,
                  mb: 2,
                  pl: 2,
                  color: theme.palette.text.secondary,
                  borderLeft: `0.25em solid ${theme.palette.divider}`,
                },
                '& table': {
                  display: 'block',
                  width: '100%',
                  overflow: 'auto',
                  mb: 2,
                  borderCollapse: 'collapse',
                  '& th': {
                    fontWeight: 600,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                  '& th, & td': {
                    p: 1,
                    border: `1px solid ${theme.palette.divider}`,
                  },
                  '& tr': {
                    bgcolor: 'background.paper',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    '&:nth-of-type(2n)': {
                      bgcolor: alpha(theme.palette.primary.main, 0.02),
                    },
                  },
                },
              }}
            >
              <ReactMarkdown className="markdown-body">
                {content}
              </ReactMarkdown>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <SEO 
        title="生成软著文档 - 易著AI | 智能软著生成工具"
        description="使用易著AI智能生成软件著作权文档，只需输入标题和选择软件类型，几分钟内即可获得符合规范的软著文档。支持图形化软件和后端软件类型。"
        keywords="软著生成,软件著作权申请,AI生成软著,软著文档生成,软著申请工具,软著在线生成,软著自动生成"
        ogImage="/logo.jpg"
        ogType="website"
      />
      {isGenerating ? (
        <Box 
          className={geist.className} 
          sx={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: alpha(theme.palette.primary.light, 0.03),
            p: { xs: 3, md: 4 },
            pt: { xs: 8, md: 10 },
          }}
        >
          <Container maxWidth="lg" sx={{ 
            flex: 1, 
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                mb: 3,
                borderRadius: 4,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                  backgroundClip: 'text',
                  color: 'transparent',
                  mb: 1,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                {generationStatus.doc === 'done' ? '生成完成' : '正在生成中'}
              </Typography>
              <Typography color="text.secondary" sx={{ textAlign: 'center', mb: 0 }}>
                {generationStatus.doc === 'done' ? '您可以查看生成的内容' : '请耐心等待，这可能需要几分钟时间'}
              </Typography>
            </Paper>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', 
              gap: { xs: 2, md: 4 },
              flex: 1,
              minHeight: 0,
              maxHeight: '70vh',
              width: '100%',
              mx: 'auto',
              '& > *': {
                minWidth: 0,
                maxWidth: '100%',
              }
            }}>
              <GenerationStatusBox
                title="项目规划"
                status={generationStatus.planning}
                content={generationContent.planning}
              />
              <GenerationStatusBox
                title="代码文档"
                status={generationStatus.code}
                content={generationContent.code}
              />
              <GenerationStatusBox
                title="说明文档"
                status={generationStatus.doc}
                content={generationContent.doc}
              />
            </Box>
          </Container>
        </Box>
      ) : (
        <Box 
          className={geist.className} 
          sx={{ 
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            bgcolor: alpha(theme.palette.primary.light, 0.03),
          }}
        >
          <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                bgcolor: 'background.paper',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
              }}
            >
              {/* 步骤1：输入标题 */}
              <Fade in={currentStep === 0} unmountOnExit>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      mb: 1,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    你的软著题目是？
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 4 }}>
                    请输入一个简洁明了的软件名称，不超过20字
                  </Typography>

                  <Box sx={{ position: 'relative' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={title}
                      onChange={handleTitleChange}
                      placeholder=""
                      error={!!titleError}
                      helperText={titleError}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title="AI智能生成标题">
                            <IconButton
                              onClick={() => setIsAIDialogOpen(true)}
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  background: alpha(theme.palette.primary.main, 0.1),
                                },
                              }}
                            >
                              <MagicIcon />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                          },
                          '&.Mui-focused': {
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                          },
                        },
                      }}
                    />
                    {!title && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: 14,
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                          perspective: '1000px',
                          height: '24px',
                          overflow: 'hidden',
                          color: 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            transform: `rotateX(${exampleIndex % 2 === 0 ? '0' : '-90'}deg)`,
                            transformOrigin: '50% 50%',
                            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            opacity: exampleIndex % 2 === 0 ? 0.6 : 0,
                          }}
                        >
                          {EXAMPLE_TITLES[exampleIndex]}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  <Alert severity="info" sx={{ mt: 2, mb: 2 }}>不知道如何起名？点击右侧魔法棒图标获取备帮助</Alert>
                </Box>
              </Fade>

              {/* 步骤2：选择软件类型 */}
              <Fade in={currentStep === 1} unmountOnExit>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      mb: 1,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    选择软件类型
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 4 }}>
                    请选择最符合您软件特点的类型
                  </Typography>

                  <List sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {SOFTWARE_TYPES.map((type) => (
                      <ListItemButton
                        key={type.id}
                        selected={selectedType === type.id}
                        onClick={() => setSelectedType(type.id)}
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          border: `1px solid ${alpha(
                            theme.palette.primary.main,
                            selectedType === type.id ? 0.2 : 0.1
                          )}`,
                          bgcolor: selectedType === type.id 
                            ? alpha(theme.palette.primary.main, 0.05)
                            : 'background.paper',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                          },
                        }}
                      >
                        <Box sx={{ textAlign: 'center', width: '100%' }}>
                          <Box
                            sx={{
                              mb: 2,
                              color: theme.palette.primary.main,
                              transform: selectedType === type.id ? 'scale(1.1)' : 'scale(1)',
                              transition: 'transform 0.2s',
                            }}
                          >
                            {type.icon}
                          </Box>
                          <Typography variant="h3" gutterBottom>
                            {type.title}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {type.description}
                          </Typography>
                        </Box>
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              </Fade>

              {/* 导航按钮 */}
              <Box
                sx={{
                  mt: 4,
                  pt: 4,
                  borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  {currentStep > 0 && (
                    <Button
                      startIcon={<ArrowBackIcon />}
                      onClick={handleBack}
                    >
                      上一步
                    </Button>
                  )}
                </Box>
                {currentStep === 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleComplete}
                    disabled={!selectedType}
                  >
                    完成
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleNext}
                    disabled={
                      (currentStep === 0 && (!title || !!titleError)) ||
                      (currentStep === 1 && !selectedType)
                    }
                  >
                    下一步
                  </Button>
                )}
              </Box>
            </Paper>
          </Container>
        </Box>
      )}

      {/* AI生成标题对话框 */}
      <Dialog
        open={isAIDialogOpen}
        onClose={() => {
          setIsAIDialogOpen(false);
          setGenerateError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>AI智能生成标题</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            请描述您的软件功能、用途或特点，AI将为您生成合适的标题
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="例如：我想做一个教育相关的系统，主要用于课程管理和学生成绩分析..."
            sx={{ mb: 2 }}
          />
          {generateError && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              action={
                errorDetails.details && (
                  <Button 
                    color="inherit" 
                    size="small"
                    onClick={() => setIsErrorDialogOpen(true)}
                  >
                    详情
                  </Button>
                )
              }
            >
              {generateError}
            </Alert>
          )}
          <Alert severity="info" sx={{ mb: 2 }}>
            提示：描述越详细，生成的标题越贴合您的需求
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAIDialogOpen(false)}>取消</Button>
          <Button
            variant="contained"
            onClick={handleGenerateTitle}
            disabled={!aiPrompt || isTitleGenerating}
          >
            {isTitleGenerating ? '生成中...' : '生成标题'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 错误详情对话框 */}
      <Dialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>错误详情</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {errorDetails.message}
          </Typography>
          <Box
            component="pre"
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.error.main, 0.05),
              border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
              overflow: 'auto',
              maxHeight: '400px',
              '& code': {
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                lineHeight: 1.5,
                display: 'block',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }
            }}
          >
            <code>
              {JSON.stringify(errorDetails.details, null, 2)}
            </code>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsErrorDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 