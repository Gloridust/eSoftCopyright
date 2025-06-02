import Head from 'next/head'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  noindex?: boolean
  ogType?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

const SEO: React.FC<SEOProps> = ({
  title = '易著AI - 自动软著生成平台',
  description = '一款智能AI软件著作权文档生成工具，几分钟内即可生成符合规范的软著文档。提供快速生成、专业规范、智能优化等功能，让软著申请更轻松。',
  keywords = '软件著作权,软著,大创,创新创业,AI生成,易著AI,软著生成,知识产权,软件登记,易著,AI软著,软著文档,软著申请流程',
  ogImage = '/logo.jpg',
  noindex = false,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author = '易著AI团队'
}) => {
  const router = useRouter()
  const siteUrl = 'https://ecopyright.innovisle.net' // 替换为实际域名
  const canonicalUrl = `${siteUrl}${router.asPath}`

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* 规范的网站标记 */}
      <link rel="canonical" href={canonicalUrl} />
      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}
      <meta name="googlebot" content={noindex ? "noindex,nofollow" : "index,follow"} />
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="易著AI" />
      <meta property="og:locale" content="zh_CN" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      <meta name="twitter:site" content="@esoftcopyright" />
      
      {/* 其他必要的meta标签 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="zh-CN" />
      <meta name="application-name" content="易著AI" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="易著AI" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* PWA相关 */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#2563eb" />
      <link rel="apple-touch-icon" href="/icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="shortcut icon" href="/favicon.ico" />
      
      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "易著AI",
            "description": description,
            "url": siteUrl,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CNY"
            },
            "publisher": {
              "@type": "Organization",
              "name": "易著AI",
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
              }
            },
            "potentialAction": {
              "@type": "UseAction",
              "target": `${siteUrl}/generate`
            }
          })
        }}
      />
      
      {/* 组织结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "易著AI",
            "url": siteUrl,
            "logo": `${siteUrl}/logo.png`,
            "sameAs": [
              "https://github.com/gloridust"
            ]
          })
        }}
      />
    </Head>
  )
}

export default SEO 