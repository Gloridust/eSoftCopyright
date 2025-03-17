import { useState, useEffect } from "react";
import { Geist } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const geist = Geist({
  subsets: ["latin"],
});

const titles = [
  "基于LSTM的成绩分析系统",
  "基于大数据的财务决策系统",
  "页岩孔隙流体力学模拟系统",
  "智能医疗影像分析系统",
  "工业物联网数据分析平台"
];

// 动画时间配置（单位：毫秒）越大越慢
const TYPING_SPEED = 100;      // 打字速度
const ERASING_SPEED = 50;      // 删除速度
const PAUSE_BEFORE_ERASE = 3000;  // 打字完成后暂停时间
const PAUSE_BEFORE_NEXT = 500;   // 删除完成后暂停时间

export default function Home() {
  const theme = useTheme();
  const [currentTitle, setCurrentTitle] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 添加鼠标移动效果
  useEffect(() => {
    const container = document.getElementById('screenshot-container');
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // 计算鼠标位置相对于图片中心的距离
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      // 计算旋转角度（最大10度），根据距离衰减
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.max(window.innerWidth, window.innerHeight) / 2;
      const factor = Math.min(1, distance / maxDistance);
      
      const rotateX = -(deltaY / maxDistance) * 10 * factor;
      const rotateY = (deltaX / maxDistance) * 10 * factor;
      
      container.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    };

    const handleMouseLeave = () => {
      // 平滑回到原始位置
      container.style.transition = 'transform 0.5s ease-out';
      container.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      setTimeout(() => {
        container.style.transition = 'transform 0.1s ease-out';
      }, 500);
    };

    // 监听整个窗口的鼠标移动
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    const currentFullTitle = titles[titleIndex];
    let timeoutId: NodeJS.Timeout;
    
    const typeCharacter = () => {
      if (currentIndex < currentFullTitle.length) {
        setCurrentTitle(currentFullTitle.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeCharacter, TYPING_SPEED);
      } else {
        timeoutId = setTimeout(eraseTitle, PAUSE_BEFORE_ERASE);
      }
    };

    const eraseTitle = () => {
      if (currentIndex > 0) {
        setCurrentTitle(prev => prev.slice(0, -1));
        currentIndex--;
        timeoutId = setTimeout(eraseTitle, ERASING_SPEED);
      } else {
        timeoutId = setTimeout(() => {
          setTitleIndex(prev => (prev + 1) % titles.length);
        }, PAUSE_BEFORE_NEXT);
      }
    };

    typeCharacter();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [titleIndex]);

  return (
    <>
      <SEO 
        title="易著AI - 自动软著生成平台 | 几分钟内生成符合规范的软著文档"
        description="易著AI是一款智能软件著作权文档生成工具，基于先进的AI技术，几分钟内即可生成符合规范的软著文档。提供快速生成、专业规范、智能优化等功能，让软著申请更轻松。"
        keywords="软件著作权,软著,AI生成,易著AI,软著生成,知识产权,软件登记,易著,AI软著,软著文档,软著申请流程,自动生成"
        ogImage="/logo.jpg"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime="2024-06-01T00:00:00Z"
      />
      <Box className={geist.className} sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            pt: { xs: 12, md: 16 },
            pb: { xs: 8, md: 12 },
          }}
        >
          {/* 背景装饰 */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.08)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
              zIndex: -1,
            }}
          />
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              {/* 左侧文字区域 */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: { xs: 'center', md: 'flex-start' },
                  textAlign: { xs: 'center', md: 'left' }
                }}>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                      backgroundClip: 'text',
                      color: 'transparent',
                      mb: 2,
                    }}
                  >
                    易著AI
                  </Typography>
                  
                  <Typography variant="h2" color="text.secondary" sx={{ mb: 4 }}>
                    你给题目，秒出软著
                  </Typography>

                  <Box 
                    sx={{ 
                      mb: 4, 
                      typography: 'h3',
                      width: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center',
                        p: 3,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.background.paper, 0.6),
                        backdropFilter: 'blur(8px)',
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
                      }}
                    >
                      <Typography 
                        component="span" 
                        sx={{
                          color: alpha(theme.palette.text.primary, 0.85),
                          fontWeight: 500,
                        }}
                      >
                        写一个题为
                      </Typography>
                      <Box
                        component="span"
                        sx={{
                          position: 'relative',
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          fontSize: '1.25rem',
                          px: 3,
                          py: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                          minHeight: { xs: '3em', sm: '2.5em' },
                          height: { xs: '3em', sm: 'auto' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: {
                            xs: '99%',
                            sm: '90%',
                            md: '90%'
                          },
                          maxWidth: '100%',
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.08)}`,
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.12)}`,
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            position: 'relative',
                            display: 'inline-flex',
                            minWidth: '4em',
                            maxWidth: '100%',
                            wordBreak: 'break-all',
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.4,
                            textAlign: 'center',
                            minHeight: { xs: '1.4em' },
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>《 </Box>
                          {currentTitle}
                          <Box
                            component="span"
                            sx={{
                              position: 'relative',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                right: '-2px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '2px',
                                height: '1.2em',
                                bgcolor: theme.palette.primary.main,
                                animation: 'blink 0.7s infinite',
                              },
                            }}
                          >
                          </Box>
                          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}> 》</Box>
                        </Box>
                      </Box>
                      
                      <Typography 
                        component="span" 
                        sx={{
                          color: alpha(theme.palette.text.primary, 0.85),
                          fontWeight: 500,
                        }}
                      >
                        的软著
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    component={Link}
                    href="/generate"
                    variant="contained"
                    size="large"
                    sx={{
                      minWidth: 200,
                      height: 56,
                    }}
                  >
                    开始尝试（暂未开放）
                  </Button>
                </Box>
              </Grid>

              {/* 右侧截图展示 */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: '-10%',
                      background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
                      borderRadius: '50%',
                    },
                  }}
                >
                  <Box
                    id="screenshot-container"
                    sx={{
                      position: 'relative',
                      aspectRatio: '4/3',
                      transform: 'perspective(1000px)',
                      transition: 'transform 0.1s ease-out',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {!imageLoaded && (
                      <Fade in={!imageLoaded}>
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: alpha(theme.palette.background.paper, 0.8),
                            backdropFilter: 'blur(8px)',
                            borderRadius: 2,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          }}
                        >
                          <Box sx={{ position: 'relative' }}>
                            <CircularProgress
                              size={48}
                              sx={{
                                color: theme.palette.primary.main,
                              }}
                            />
                            <Box
                              sx={{
                                position: 'absolute',
                                inset: -8,
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                  '0%': {
                                    transform: 'scale(0.95)',
                                    opacity: 0.5,
                                  },
                                  '70%': {
                                    transform: 'scale(1.1)',
                                    opacity: 0.2,
                                  },
                                  '100%': {
                                    transform: 'scale(0.95)',
                                    opacity: 0.5,
                                  },
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </Fade>
                    )}
          <Image
                      src="/screenshot.png"
                      alt="易著软件截图"
                      fill
                      className="object-contain"
                      priority
                      onLoadingComplete={() => setImageLoaded(true)}
                      style={{
                        opacity: imageLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* 特性介绍 */}
        <Box
          component="section"
          sx={{
            position: 'relative',
            py: { xs: 8, md: 12 },
            background: alpha(theme.palette.primary.light, 0.03),
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              align="center"
              sx={{
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              为什么选择易著AI？
            </Typography>
            
            <Typography
              variant="h3"
              align="center"
              color="text.secondary"
              sx={{ mb: 8 }}
            >
              专业的软著生成工具，让您的创作更轻松、更高效
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <SpeedIcon color="primary" sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h3" gutterBottom>
                      快速生成
                    </Typography>
                    <Typography color="text.secondary">
                      基于AI技术，几分钟内即可生成完整的软著文档，省时省力。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <SecurityIcon color="primary" sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h3" gutterBottom>
                      专业规范
                    </Typography>
                    <Typography color="text.secondary">
                      严格遵循软著申请规范，确保生成的文档符合要求。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <TrendingUpIcon color="primary" sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="h3" gutterBottom>
                      智能优化
                    </Typography>
                    <Typography color="text.secondary">
                      自动优化文档结构和内容，提高软著通过率。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Footer />
      </Box>
    </>
  );
}
