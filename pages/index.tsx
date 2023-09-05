import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import Bridge from "../components/Icons/Bridge";
import Logo from "../components/Icons/Logo";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
	const router = useRouter();
	const { photoId } = router.query;
	const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

	const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		// This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
		if (lastViewedPhoto && !photoId) {
			lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
			setLastViewedPhoto(null);
		}
	}, [photoId, lastViewedPhoto, setLastViewedPhoto]);

	return (
		<>
			<Head>
				<title>Happy Teachers' Day 2023</title>
				{/* <meta
          property="og:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        /> */}
			</Head>
			<main className="mx-auto max-w-[1960px] p-4">
				{photoId && (
					<Modal
						images={images}
						onClose={() => {
							setLastViewedPhoto(photoId);
						}}
					/>
				)}
				<div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
					<div className="after:content relative mb-4 flex h-[300px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
						<div className="absolute inset-0 flex items-center justify-center opacity-20">
							<span className="flex max-h-full max-w-full items-center justify-center">
								<Bridge />
							</span>
							<span className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
						</div>
						<Image
							alt="spire logo"
							className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
							src={`/spr-logo.png`}
							width={128}
							height={128}
						/>
						<h1 className="mb-2 mt-4 text-base font-bold uppercase tracking-widest">
							HAPPY TEACHERS DAY 2023
						</h1>
						<p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
							Notes from SPIRE Lab Family!
						</p>
					</div>
					{/* <>
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
              >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 scale-100 transition will-change-auto group-hover:scale-150"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                (max-width: 1280px) 50vw,
                (max-width: 1536px) 33vw,
                25vw"
                />
            </Link>
          ))}
          </> */}
					<div>
						{notes2.map((info) => (
							<div
								key={info.Timestamp}
								className="after:content group relative mb-4 block w-full  justify-end p-8 after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
							>
								<p className="mb-2 mt-4 whitespace-pre-line text-center text-base font-normal tracking-wide text-white">
									{info["Your note"]}
								</p>
								<h1 className="mr-4 text-right text-white/75">
									-
									{info[
										"Display your name under the message?"
									] === "Yes"
										? info["Your name"]
										: "anonymous"}
								</h1>
							</div>
						))}
					</div>
				</div>
			</main>
			<footer className="p-6 text-center text-white/80 sm:p-12">
				Thank you{" "}
				<a
					href="https://edelsonphotography.com/"
					target="_blank"
					className="font-semibold hover:text-white"
					rel="noreferrer"
				>
					Prasanta Sir
				</a>{" "}
				for everything{" "}
				<p className="text-lg text-red-500">&hearts;&nbsp;</p>
			</footer>
		</>
	);
};

export default Home;

export async function getStaticProps() {
	const results = await cloudinary.v2.search
		.expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
		.sort_by("public_id", "desc")
		.max_results(4)
		.execute();
	let reducedResults: ImageProps[] = [];

	let i = 0;
	for (let result of results.resources) {
		reducedResults.push({
			id: i,
			height: result.height,
			width: result.width,
			public_id: result.public_id,
			format: result.format,
		});
		i++;
	}

	const blurImagePromises = results.resources.map((image: ImageProps) => {
		return getBase64ImageUrl(image);
	});
	const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

	for (let i = 0; i < reducedResults.length; i++) {
		reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
	}

	return {
		props: {
			images: reducedResults,
		},
	};
}

const notes2 = [
	{
		Timestamp: "9/5/2023 13:52:37",
		"Your name": "Keerthana",
		"Display your name under the message?": "Yes",
		"Your note":
			"Thank you sir for supporting me and guiding me and ensuring I heal faster!",
	},
	{
		Timestamp: "9/5/2023 13:57:06",
		"Your name": "deek",
		"Display your name under the message?": "",
		"Your note":
			"Thankyou for letting us know that we can do many more things in a day. Just got wondered by seeing your busy schedules and still you have a smiling face in the late night meetings.",
	},
	{
		Timestamp: "9/5/2023 14:03:33",
		"Your name": "sathvik",
		"Display your name under the message?": "No",
		"Your note":
			"Thank you for your mentorship and guidance. We are grateful for your patience and kindness in dealing with us. We cherish the freedom and support we get to explore our creativity, interests and goals. We are lucky to be working under you. ",
	},
	{
		Timestamp: "9/5/2023 14:07:48",
		"Your name": "Murali",
		"Display your name under the message?": "No",
		"Your note":
			"It is one of my greatest fortune to work for you. Your patience and drive to ensure we understand what you say in class and in meetings is truly one of a kind.",
	},
	{
		Timestamp: "9/5/2023 14:44:51",
		"Your name": "Sonakshi Chauhan",
		"Display your name under the message?": "Yes",
		"Your note":
			"Happy Teachers Day, Sir. Thank you for all the guidance and mindfulness. I'm indebted to your support and motivated by your dedication and unstoppable attitude. Thank you for inspiring me to do impactful research. I pray to God to give you undying strength, happiness, and success. I'm glad to be your student.",
	},
	{
		Timestamp: "9/5/2023 14:54:32",
		"Your name": "Veerababu Dharanalakota ",
		"Display your name under the message?": "Yes",
		"Your note":
			"I wonder how you are able to manage the time for everything. Hats off to you Sir!",
	},
	{
		Timestamp: "9/5/2023 14:58:57",
		"Your name": "ROOPA",
		"Display your name under the message?": "Yes",
		"Your note":
			"Dear Sir ,\n\n\nWish you happy Teachers Day, on this special day, I want to express my heartfelt gratitude for being a guide in my career journey.\nYour wisdom and support have made a lasting impact and your influence will extend beyond the class room .\n\nThank you once again for the Support we have received from you!\n\nRegards\nRoopa",
	},
	{
		Timestamp: "9/5/2023 15:11:41",
		"Your name": "Bhargavi Badal",
		"Display your name under the message?": "No",
		"Your note":
			'Sir, We have learned a lot after coming to SPIRE LAB along with your guidance that, "We can gain our life dreams if we\'re determined and pushed to learn." Sometimes Thank you is insufficient due to do not expressing the depth of my gratitude fully. Those words may feel insufficient for an extraordinary Teacher, Mentor, and sometime giving guidance. Thank you Sir.',
	},
	{
		Timestamp: "9/5/2023 15:23:09",
		"Your name": "Himanshi Varma",
		"Display your name under the message?": "Yes",
		"Your note":
			"Sir, your friendly nature and open-mindedness make it easy for us to approach you with any doubt. Your support is truly appreciated. Thank you for illuminating our path with your guidance and knowledge.  Happy Teacher's Day Sir 🧡🧡🧡",
	},
	{
		Timestamp: "9/5/2023 15:38:38",
		"Your name": "Ashwin Raikar",
		"Display your name under the message?": "Yes",
		"Your note":
			"শব্দের একটি সিম্ফনি\nমন বিস্ময়ে ভরে যায়\nএকটি নতুন গানের জন্ম হয়\n\n- পৃথিবী সবার শেখার জন্য একটি বড় শ্রেণীকক্ষ।\n(The world is a big-classroom for everyone to be inspired)\n\nThank you, Prasanta Sir for InSPIREing us",
	},
	{
		Timestamp: "9/5/2023 15:41:38",
		"Your name": "Sumit Sharma",
		"Display your name under the message?": "No",
		"Your note":
			"Thank you sir for taking me under your guidance and providing all the encouragement and support in my journey so far in the spire lab.",
	},
	{
		Timestamp: "9/5/2023 15:41:50",
		"Your name": "Sandhya A",
		"Display your name under the message?": "Yes",
		"Your note":
			"Your patience, kindness, and understanding have helped me to grow and succeed in ways that I never though possible. You are a mentor and a role model! I am so grateful for everythinf you have done for me. A Very Happiest Teacher's day to you sir.",
	},
	{
		Timestamp: "9/5/2023 17:01:56",
		"Your name": "Shaique",
		"Display your name under the message?": "Yes",
		"Your note":
			"You are one of the very few people I want to imitate in my life. Will be lucky if I could just make to 1%. ",
	},
  {
		Timestamp: "9/5/2023 17:01:56",
		"Your name": "vrx",
		"Display your name under the message?": "No",
		"Your note":
			"time after time,\n I swam beneath your waves;\n stones fragment to grains,\n my mind pearls into _.",
	}
];
