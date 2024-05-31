import Image from 'next/image';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

import { useRouter } from 'next/router';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <nav className="mt-10 ml-60 mr-60 flex justify-between items-center rounded-full bg-white">
        <div>
          <button
            className="ml-4 p-2 rounded-full hover:bg-gray-100 text-black"
            onClick={handleBack}
          >
            <ChevronLeftIcon className="h-5 w-5" /> {/* Using ChevronLeftIcon */}
            
          </button>
        </div>
        <div>
          <Image
            className="h-[100px] w-[100px] "
            src="/images/logo.png"
            height={500}
            width={500}
            alt="CLT"
          />
        </div>
        <div></div>
      </nav>
      {children}
    </>
  );
}
