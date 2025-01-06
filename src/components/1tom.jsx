"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import Image from "next/image";
import {
  mysql,
  pg,
  mongo,  
  mongoDB,
  mongodbhigh,
  oracleDB,
  oracle,
  neonDB,
} from "@/components/logo";

const Circle = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export default function OnePage({ className }) {
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);
  const div6Ref = useRef(null);
  const div7Ref = useRef(null);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref} className={"bg-white"}>
            <Icons.user />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-20 bg-slate-900">
            <Icons.qs />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref} className="size-16 bg-white">
            <Image src={mongoDB} alt="mongo" />
          </Circle>
          <Circle ref={div2Ref} className="size-16 bg-white">
            <Image src={mysql} alt="mysql" />
          </Circle>
          <Circle ref={div3Ref} className="size-16 bg-white">
            <Image src={pg} alt="postgres" />
          </Circle>
          <Circle ref={div4Ref} className="size-16 bg-white">
            <Image src={oracle} alt="oracle" />
          </Circle>
          <Circle ref={div5Ref} className="size-16 bg-white">
            <Image src={neonDB} alt="neonDB" />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={3}
      />
    </div>
  );
}

const Icons = {
  openai: () => (
    <svg
      width="100"
      height="100"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  ),
  postgres: () => (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/330px-Postgresql_elephant.svg.png"
      width="100"
      height="100"
      alt="postgres"
      priority
    />
  ),
  qs: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="42"
      fill="currentColor"
      viewBox="0 0 42 42"
    >
      <path
        fill="#fff"
        d="M19.0357 8C20.5531 8 21 9.27461 21 10.8438V16.3281H23.5536V14.2212C23.5536 13.1976 23.9468 12.216 24.6467 11.4922L25.0529 11.0721C24.9729 10.8772 24.9286 10.6627 24.9286 10.4375C24.9286 9.54004 25.6321 8.8125 26.5 8.8125C27.3679 8.8125 28.0714 9.54004 28.0714 10.4375C28.0714 11.335 27.3679 12.0625 26.5 12.0625C26.2822 12.0625 26.0748 12.0167 25.8863 11.9339L25.4801 12.354C25.0012 12.8492 24.7321 13.5209 24.7321 14.2212V16.3281H28.9714C29.2045 15.7326 29.7691 15.3125 30.4286 15.3125C31.2964 15.3125 32 16.04 32 16.9375C32 17.835 31.2964 18.5625 30.4286 18.5625C29.7691 18.5625 29.2045 18.1424 28.9714 17.5469H21V21.2031H25.0428C25.2759 20.6076 25.8405 20.1875 26.5 20.1875C27.3679 20.1875 28.0714 20.915 28.0714 21.8125C28.0714 22.71 27.3679 23.4375 26.5 23.4375C25.8405 23.4375 25.2759 23.0174 25.0428 22.4219H21V26.0781H24.4125C25.4023 26.0781 26.3516 26.4847 27.0515 27.2085L29.0292 29.2536C29.2177 29.1708 29.4251 29.125 29.6429 29.125C30.5107 29.125 31.2143 29.8525 31.2143 30.75C31.2143 31.6475 30.5107 32.375 29.6429 32.375C28.775 32.375 28.0714 31.6475 28.0714 30.75C28.0714 30.5248 28.1157 30.3103 28.1958 30.1154L26.2181 28.0703C25.7392 27.5751 25.0897 27.2969 24.4125 27.2969H21V31.1562C21 32.7254 20.5531 34 19.0357 34C17.6165 34 16.4478 32.8879 16.3004 31.4559C16.0451 31.527 15.775 31.5625 15.5 31.5625C13.7665 31.5625 12.3571 30.1051 12.3571 28.3125C12.3571 27.9367 12.421 27.5711 12.5339 27.2359C11.0509 26.657 10 25.1742 10 23.4375C10 21.8176 10.9183 20.416 12.2491 19.766C11.8219 19.2125 11.5714 18.5117 11.5714 17.75C11.5714 16.191 12.6321 14.891 14.0464 14.5711C13.9679 14.2918 13.9286 13.9922 13.9286 13.6875C13.9286 12.1691 14.9402 10.8895 16.3004 10.534C16.4478 9.11211 17.6165 8 19.0357 8Z"
      />
    </svg>
  ),
  user: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};
