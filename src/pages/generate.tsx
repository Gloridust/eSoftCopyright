import { useState, useEffect } from 'react';
import { Geist } from "next/font/google";
import SEO from "@/components/SEO";
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
  "智能教学辅助系统",
  "医疗影像分析平台",
  "工业数据采集系统",
  "企业人事管理软件",
  "智慧校园服务平台",
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
  const [generateError, setGenerateError] = useState('');

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
    if (value.length > 20) {
      setTitleError('标题不能超过20个字');
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

    setIsGenerating(true);
    setGenerateError('');
    try {
      const response = await fetch('/api/generate-title', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await response.json();
      
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
    } catch (error) {
      console.error('生成标题失败:', error);
      setGenerateError(error instanceof Error ? error.message : '生成标题失败，请稍后重试');
    } finally {
      setIsGenerating(false);
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

  return (
    <>
      <SEO title="生成软著 - 易著" description="填写表单，快速生成软著" />
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
            </Box>
          </Paper>
        </Container>
      </Box>

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
            <Alert severity="error" sx={{ mb: 2 }}>
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
            disabled={!aiPrompt || isGenerating}
          >
            {isGenerating ? '生成中...' : '生成标题'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 