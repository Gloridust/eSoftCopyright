import { Geist } from "next/font/google";
import SEO from "@/components/SEO";
import Footer from "@/components/Footer";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  alpha,
  Chip,
  Avatar,
  Link as MuiLink,
} from '@mui/material';
import {
  Code as CodeIcon,
  Brush as BrushIcon,
  Psychology as PsychologyIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';

const geist = Geist({
  subsets: ["latin"],
});

// 技术栈数据
const techStacks = [
  {
    category: "前端技术",
    items: ["Next.js", "React", "TypeScript", "Material-UI", "TailwindCSS"]
  },
  {
    category: "AI 技术",
    items: ["OpenAI GPT-4", "Langchain", "Embeddings", "Prompt Engineering"]
  },
  {
    category: "后端技术",
    items: ["Node.js", "Express", "MongoDB", "Redis", "RESTful API"]
  },
  {
    category: "开发工具",
    items: ["Git", "VS Code", "Docker", "Vercel", "GitHub Actions"]
  }
];

// 团队成员数据
const teamMembers = [
  {
    name: "Gloridust",
    role: "全栈开发",
    avatar: "/avatar.png",
    github: "https://github.com/Gloridust"
  }
];

export default function About() {
  const theme = useTheme();

  return (
    <>
      <SEO 
        title="关于易著AI - 团队介绍与技术栈 | 软著生成平台"
        description="了解易著AI团队、技术栈和项目愿景。易著AI是一个基于人工智能的软件著作权文档生成工具，旨在帮助开发者快速、高效地完成软著申请文档。"
        keywords="易著AI,软著生成团队,软著技术栈,AI软著,软著申请平台,软著生成工具,软件著作权,技术团队"
        ogImage="/logo.jpg"
        ogType="website"
        publishedTime="2024-01-01T00:00:00Z"
        modifiedTime="2024-06-01T00:00:00Z"
      />
      <Box 
        className={geist.className} 
        sx={{ 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: alpha(theme.palette.primary.light, 0.03),
          pt: { xs: 12, md: 16 },
        }}
      >
        <Container maxWidth="lg">
          {/* 项目介绍 */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Typography
              variant="h1"
              sx={{
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                backgroundClip: 'text',
                color: 'transparent',
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              关于易著AI
            </Typography>
            <Typography 
              variant="h2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              易著AI 是一个基于人工智能的软件著作权文档生成工具，旨在帮助开发者快速、高效地完成软著申请文档。
              我们利用先进的 AI 技术，将繁琐的文档编写过程变得简单易行。
            </Typography>
          </Box>

          {/* 技术栈 */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontSize: { xs: '1.75rem', md: '2rem' },
              }}
            >
              技术栈
            </Typography>
            <Grid container spacing={3}>
              {techStacks.map((stack, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          mb: 2,
                          pb: 1,
                          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                      >
                        {stack.category}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {stack.items.map((item, i) => (
                          <Chip
                            key={i}
                            label={item}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2),
                              },
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* 开发团队 */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontSize: { xs: '1.75rem', md: '2rem' },
              }}
            >
              开发团队
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {teamMembers.map((member, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        sx={{
                          width: 80,
                          height: 80,
                          mx: 'auto',
                          mb: 2,
                          border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                      />
                      <Typography variant="h6" gutterBottom>
                        {member.name}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {member.role}
                      </Typography>
                      <MuiLink
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'text.secondary',
                          '&:hover': {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        <GitHubIcon />
                      </MuiLink>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* 项目愿景 */}
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                mb: 4,
                textAlign: 'center',
                fontSize: { xs: '1.75rem', md: '2rem' },
              }}
            >
              项目愿景
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <CodeIcon
                    sx={{
                      fontSize: 48,
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    简化开发流程
                  </Typography>
                  <Typography color="text.secondary">
                    让软著申请不再是开发过程中的负担，专注于创新和开发本身。
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <BrushIcon
                    sx={{
                      fontSize: 48,
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    优化用户体验
                  </Typography>
                  <Typography color="text.secondary">
                    提供直观、易用的界面，让每个开发者都能轻松完成软著申请。
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <PsychologyIcon
                    sx={{
                      fontSize: 48,
                      color: theme.palette.primary.main,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    持续创新
                  </Typography>
                  <Typography color="text.secondary">
                    不断优化AI算法，提供更智能、更准确的文档生成服务。
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Footer />
      </Box>
    </>
  );
} 