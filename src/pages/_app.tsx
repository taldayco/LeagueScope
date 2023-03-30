import '../globals.css'

import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://leaguescope.vercel.app/',
          siteName: 'LeagueScope',
        }}
        twitter={{
          handle: '@E1Iipse',
          site: '@E1Iipse',
          cardType: 'summary_large_image',
        }}
      />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}
