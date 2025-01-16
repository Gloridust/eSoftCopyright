import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // 处理滚动
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 处理移动端菜单点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-5xl transition-all duration-300 ${isScrolled ? 'top-2' : 'top-4'}`}>
      <div className="bg-white shadow-lg rounded-full px-4 md:px-6 py-2 md:py-3 flex justify-between items-center transition-colors duration-200">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-base md:text-lg text-gray-900 hover:text-primary transition-colors duration-200">
            易著AI
          </span>
        </Link>

        {/* 移动端菜单按钮 */}
        <div className="md:hidden relative" ref={mobileMenuRef}>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* 移动端菜单 */}
          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1">
              <Link 
                href="/" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                首页
              </Link>
              <Link 
                href="/generate" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                生成
              </Link>
              <Link 
                href="/docs" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                文档
              </Link>
              <Link 
                href="/about" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                关于
              </Link>
            </div>
          )}
        </div>

        {/* 桌面端导航 */}
        <nav className="hidden md:block">
          <ul className="flex space-x-8 items-center text-base">
            <li>
              <Link 
                href="/" 
                className="hover:text-primary transition-colors duration-200"
              >
                首页介绍
              </Link>
            </li>
            <li>
              <Link 
                href="/generate" 
                className="hover:text-primary transition-colors duration-200"
              >
                生成软著
              </Link>
            </li>
            <li>
              <Link 
                href="/docs" 
                className="hover:text-primary transition-colors duration-200"
              >
                使用文档
              </Link>
            </li>
            <li>
              <Link 
                href="/about" 
                className="hover:text-primary transition-colors duration-200"
              >
                关于本站
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header 