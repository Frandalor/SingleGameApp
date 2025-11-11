import React from 'react';
import Button from './Button';
import { LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

function HeroBar() {
  return (
    <div className="bg-pattern flex h-[14rem] w-full items-center justify-between px-3 md:px-[10%] lg:px-[20%]">
      <Link to={'/'}>
        <div className="flex cursor-pointer flex-col justify-start p-6 text-4xl font-extrabold md:text-6xl">
          <p>Single</p>
          <p className="ml-10 mt-0">Game</p>
        </div>
      </Link>

      <div className="h:18 flex min-w-[8rem] flex-col items-center justify-center gap-4 rounded-xl bg-mySecondary px-2 py-2 md:h-36 md:p-4 [&>button]:w-full [&>button]:bg-accent1">
        <Button text={'Register'} Icon={UserPlus} />
        <Button text={'Login'} Icon={LogIn} />
      </div>
    </div>
  );
}

export default HeroBar;
