import { useState, useEffect } from "react";
import { Geist } from "next/font/google";
import Link from "next/link";

const geist = Geist({
  subsets: ["latin"],
});

const titles = [
  "基于人工智能的NLP教学辅助系统",
  "基于大数据的财务决策支持系统",
  "页岩气藏孔隙结构与流体力学研究系统",
  "智能医疗影像分析与诊断辅助系统",
  "工业物联网数据采集与分析平台"
];

// 动画时间配置（单位：毫秒）
const TYPING_SPEED = 150;      // 打字速度
const ERASING_SPEED = 75;      // 删除速度
const PAUSE_BEFORE_ERASE = 3000;  // 打字完成后暂停时间
const PAUSE_BEFORE_NEXT = 1000;   // 删除完成后暂停时间

export default function Home() {
  const [currentTitle, setCurrentTitle] = useState("");
  const [titleIndex, setTitleIndex] = useState(0);

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
    <div className={`${geist.className} min-h-screen flex flex-col items-center justify-center relative overflow-hidden`}>
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <main className="max-w-4xl mx-auto px-4 text-center z-10">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
          易著
        </h1>
        
        <h2 className="text-2xl mb-12 text-foreground/80">
          你给题目，秒出软著
        </h2>

        <div className="mb-12 flex items-center justify-center text-lg">
          <span>写一个题为</span>
          <span className="title-input mx-2 relative">
            《{currentTitle}
            <span className="typing-cursor" />
            》
          </span>
          <span>的软著</span>
        </div>

        <Link 
          href="/generate"
          className="btn-primary inline-flex items-center group"
        >
          开始尝试
          <svg 
            className="ml-2 w-4 h-4 transform transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 7l5 5m0 0l-5 5m5-5H6" 
            />
          </svg>
        </Link>
      </main>
    </div>
  );
}
