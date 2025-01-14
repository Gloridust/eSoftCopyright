import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  noindex?: boolean
}

const SEO: React.FC<SEOProps> = ({
  title = '易著 - AI自动软著生成平台',
  description = '一款智能AI软件著作权文档生成工具，几分钟内即可生成符合规范的软著文档。提供快速生成、专业规范、智能优化等功能，让软著申请更轻松。',
  keywords = '软件著作权,软著,大创,创新创业,AI生成,软著申请,软著生成,知识产权,软件登记,易著',
  ogImage = '/og-image.png',
  noindex = false
}) => {
  const siteUrl = 'https://esoftcopyright.com' // 替换为实际域名

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* 规范的网站标记 */}
      <link rel="canonical" href={siteUrl} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content="易著" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* 其他必要的meta标签 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="zh-CN" />
      <meta name="application-name" content="易著" />
      
      {/* PWA相关 */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#2563eb" />
      <link rel="apple-touch-icon" href="/icon-192x192.png" />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "易著",
            "description": description,
            "url": siteUrl,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CNY"
            }
          })
        }}
      />
    </Head>
  )
}

export default SEO 