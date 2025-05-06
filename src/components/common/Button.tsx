import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg' | 'full';
  variant?: 'fill' | 'outline';
  color?: 'rose' | 'violet';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
}

export default function Button({
  size = 'sm',
  variant = 'fill',
  color = 'rose',
  rounded = 'sm',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-medium transition-all duration-300',

        // 둥근 정도 설정
        rounded === 'sm' && 'rounded-sm',
        rounded === 'md' && 'rounded-md',
        rounded === 'lg' && 'rounded-xl',
        rounded === 'full' && 'rounded-full',

        //사이즈
        size === 'sm' && 'w-[70px] h-10 text-sm px-3',
        size === 'md' && 'w-[160px] h-10 text-sm px-4',
        size === 'lg' && 'w-[320px] h-12 text-base px-6',
        size === 'full' && 'w-full h-12 text-lg px-6',

        // 스타일 및 컬러
        variant === 'fill' &&
          color === 'rose' &&
          'bg-rose-500 text-white hover:bg-rose-600 active:bg-rose-700',
        variant === 'fill' &&
          color === 'violet' &&
          'bg-violet-500 text-white hover:bg-violet-600 active:bg-rose-700',
        variant === 'outline' &&
          color === 'rose' &&
          'border border-rose-500 text-rose-500 bg-[rgba(255,255,255,0.1)] hover:bg-rose-600 hover:text-white active:bg-rose-700',
        variant === 'outline' &&
          color === 'violet' &&
          'border border-violet-500 text-violet-500 bg-[rgba(255,255,255,0.1)] hover:bg-violet-600 hover:text-white active:bg-violet-700',

        // 커스텀 클래스
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
