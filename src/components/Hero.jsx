import React from 'react';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';

const ContainerScrollTitle = () => {
  return (
    <ContainerScroll
      titleComponent={
        <div className="container">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Query Your Data with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Natural Language
            </span>
          </h1>
          <p className="visiblity:hidden max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            {/* Transform how you interact with databases. QuerySage AI understands your
            questions and converts them into precise database queries. */}
          </p>
        </div>
      }
    />
  );
};

export default ContainerScrollTitle;