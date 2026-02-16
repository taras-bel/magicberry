"use client"

import { useEffect } from 'react'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'

// Google Analytics 4
function GoogleAnalytics() {
  useEffect(() => {
    // Загружаем Google Analytics
    if (process.env.NEXT_PUBLIC_GA_ID) {
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
      document.head.appendChild(script1)

      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `
      document.head.appendChild(script2)
    }
  }, [])

  return null
}

// Яндекс.Метрика
function YandexMetrika() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_YM_ID) {
      // Загружаем Яндекс.Метрику
      const script = document.createElement('script')
      script.innerHTML = `
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(${process.env.NEXT_PUBLIC_YM_ID}, "init", {
          clickmap:true,
          trackLinks:true,
          accurateTrackBounce:true,
          webvisor:true
        });
      `
      document.head.appendChild(script)

      // Создаем noscript элемент
      const noscript = document.createElement('noscript')
      const div = document.createElement('div')
      const img = document.createElement('img')
      img.src = `https://mc.yandex.ru/watch/${process.env.NEXT_PUBLIC_YM_ID}`
      img.style.position = 'absolute'
      img.style.left = '-9999px'
      img.alt = ''
      div.appendChild(img)
      noscript.appendChild(div)
      document.body.appendChild(noscript)
    }
  }, [])

  return null
}

// Hotjar для heatmaps и записи сессий
function Hotjar() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_HJID) {
      const script = document.createElement('script')
      script.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HJID},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `
      document.head.appendChild(script)
    }
  }, [])

  return null
}

// Facebook Pixel
function FacebookPixel() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
      const script = document.createElement('script')
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(script)

      // noscript pixel
      const noscript = document.createElement('noscript')
      const img = document.createElement('img')
      img.height = 1
      img.width = 1
      img.style.display = 'none'
      img.src = `https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_FB_PIXEL_ID}&ev=PageView&noscript=1`
      noscript.appendChild(img)
      document.body.appendChild(noscript)
    }
  }, [])

  return null
}

export default function Analytics() {
  return (
    <>
      <VercelAnalytics />
      <GoogleAnalytics />
      <YandexMetrika />
      <Hotjar />
      <FacebookPixel />
    </>
  )
}
