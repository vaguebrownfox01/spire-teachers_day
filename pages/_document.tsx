import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					<link rel="icon" href="/spr-logo.png" />
					<meta
						name="description"
						content="happy teacher's day 2023"
					/>
					<meta
						property="og:site_name"
						content="spirelab-happy-teachers-day.vercel.app"
					/>
					<meta
						property="og:description"
						content="Notes from SPIRE Lab family"
					/>
					{/* <meta property="og:title" content="Next.js Conf 2022 Pictures" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Next.js Conf 2022 Pictures" /> */}
					{/* <meta
            name="twitter:description"
            content="See pictures from Next.js Conf and the After Party."
          /> */}
				</Head>
				<body className="bg-black antialiased">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
