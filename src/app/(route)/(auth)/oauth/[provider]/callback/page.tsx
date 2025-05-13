'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  OAuthProvider,
  OAuthLoginResponse,
  OAuthCallbackParams,
} from '@/types/oauth';
import { handleSocialCallback } from '@/services/oauth';

export default function OAuthCallbackPage({
  params,
}: {
  params: { provider: OAuthProvider };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { provider } = params;

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        // 제공자별 추가 파라미터 처리
        const additionalParams = getAdditionalParams(provider, searchParams);

        const result = await handleSocialCallback(
          provider,
          code,
          additionalParams
        );

        // 제공자별 리다이렉트 처리
        await handleRedirect(provider, result, router);
      } catch (error) {
        console.error(`${provider} 로그인 콜백 처리 중 오류:`, error);
        router.push(`/login?error=${provider}-login-failed`);
      }
    };

    handleCallback();
  }, [provider, router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">소셜 로그인 처리 중...</h1>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

// 제공자별 추가 파라미터 처리
function getAdditionalParams(
  provider: OAuthProvider,
  searchParams: URLSearchParams
): OAuthCallbackParams {
  const code = searchParams.get('code') || '';
  switch (provider) {
    case 'kakao':
      return {
        code,
        state: searchParams.get('state') || undefined,
      };
    case 'naver':
      return {
        code,
        state: searchParams.get('state') || undefined,
      };
    case 'google':
      return {
        code,
        scope: searchParams.get('scope') || undefined,
      };
    default:
      return { code };
  }
}

// 제공자별 리다이렉트 처리
async function handleRedirect(
  provider: OAuthProvider,
  result: OAuthLoginResponse,
  router: ReturnType<typeof useRouter>
) {
  if (!result.isProfileComplete) {
    router.push('/complete-profile');
    return;
  }

  // 제공자별 추가 리다이렉트 로직
  switch (provider) {
    case 'kakao':
      // 카카오 특화 리다이렉트
      router.push(result.redirectUrl);
      break;
    case 'naver':
      // 네이버 특화 리다이렉트
      router.push(result.redirectUrl);
      break;
    case 'google':
      // 구글 특화 리다이렉트
      router.push(result.redirectUrl);
      break;
    default:
      router.push(result.redirectUrl);
  }
}
