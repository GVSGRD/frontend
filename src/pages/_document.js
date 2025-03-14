// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en"> {/* Add language attribute for SEO */}
        <Head>
          {/* Add Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap"
            rel="stylesheet"
          />

          {/* Add favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Add meta tags for SEO */}
          <meta charSet="UTF-8" />
          <meta name="description" content="Your app description here" />
          <meta name="keywords" content="your, keywords, here" />
          <meta name="author" content="Your Name" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          {/* Add Open Graph meta tags for social sharing */}
          <meta property="og:title" content="Your App Title" />
          <meta property="og:description" content="Your app description here" />
          <meta property="og:image" content="/og-image.jpg" />
          <meta property="og:url" content="https://yourapp.com" />

          {/* Add Twitter meta tags for social sharing */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Your App Title" />
          <meta name="twitter:description" content="Your app description here" />
          <meta name="twitter:image" content="/twitter-image.jpg" />

          {/* Add external scripts (e.g., analytics) */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_TRACKING_ID"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'YOUR_GA_TRACKING_ID');
              `,
            }}
          />
        </Head>
        <body>
          {/* Main content of the app */}
          <Main />

          {/* Next.js scripts */}
          <NextScript />

          {/* Add custom scripts or modals here */}
          <div id="modal-root"></div> {/* For modals or portals */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;