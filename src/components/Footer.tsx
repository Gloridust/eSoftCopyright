import React from 'react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-gray-100/50" />
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary opacity-[0.02] rounded-full blur-3xl" />
        <div className="absolute -top-48 right-1/4 w-96 h-96 bg-blue-400 opacity-[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="text-center text-gray-500 text-sm">
          © {currentYear} 易著AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer 