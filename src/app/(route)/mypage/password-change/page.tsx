'use client';

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import { EyeIcon } from '@heroicons/react/24/solid';

export default function PasswordChangePage() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChangePasswordState = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: 'current' | 'new' | 'confirm'
  ) => {
    e.preventDefault();

    setPasswords((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleChangePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('입력한 비밀번호 값 : ', passwords);
  };

  return (
    <div className="w-full min-h-full flex flex-col justify-between gap-10 px-16 py-10">
      <form
        className="flex flex-col justify-between gap-16"
        onSubmit={handleChangePasswordSubmit}
      >
        {/* 현재 비밀번호 */}
        <div>
          <label
            htmlFor="password-origin"
            className="text-3xl mb-3 cursor-pointer"
          >
            현재 비밀번호
          </label>
          <div className="flex justify-between items-center py-3 px-7 border border-black rounded-xl">
            <input
              className="w-3/4 h-8"
              id="password-origin"
              name="password-origin"
              type={showPassword.current ? 'text' : 'password'}
              placeholder="현재 비밀번호 입력"
              value={passwords.current}
              onChange={(e) => handleChangePasswordState(e, 'current')}
            />
            <EyeIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  current: !prev.current,
                }))
              }
            />
          </div>
        </div>

        {/* 신규 비밀번호 */}
        <div>
          <label
            htmlFor="password-new"
            className="text-3xl mb-3 cursor-pointer"
          >
            신규 비밀번호
          </label>
          <div className="mb-10 flex justify-between items-center py-3 px-7 border border-black rounded-xl">
            <input
              className="w-3/4 h-8"
              id="password-new"
              name="password-new"
              type={showPassword.new ? 'text' : 'password'}
              placeholder="신규 비밀번호 입력"
              value={passwords.new}
              onChange={(e) => handleChangePasswordState(e, 'new')}
            />
            <EyeIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  new: !prev.new,
                }))
              }
            />
          </div>

          <div className="flex justify-between items-center py-3 px-7 border border-black rounded-xl">
            <input
              className="w-3/4 h-8"
              id="password-new-confirm"
              name="password-new-confirm"
              type={showPassword.confirm ? 'text' : 'password'}
              placeholder="신규 비밀번호 확인"
              value={passwords.confirm}
              onChange={(e) => handleChangePasswordState(e, 'confirm')}
            />
            <EyeIcon
              className="w-6 h-6 cursor-pointer"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
            />
          </div>
        </div>

        <div>
          <Button
            rounded="lg"
            variant="outline"
            size="full"
            color="violet"
            type="submit"
          >
            비밀번호 변경
          </Button>
        </div>
      </form>
    </div>
  );
}
