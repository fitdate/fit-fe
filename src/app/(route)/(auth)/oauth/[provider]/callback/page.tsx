'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  OAuthProvider,
  OAuthLoginResponse,
  OAuthCallbackParams,
} from '@/types/oauth.type';
import { handleSocialCallback } from '@/services/oauth';

type SearchParams = {
  code?: string;
  state?: string;
  scope?: string;
};

interface OAuthCallbackPageProps {
  params: { provider: string };
  searchParams: SearchParams;
}

const OAuthCallbackPage = ({
  params,
  searchParams,
}: OAuthCallbackPageProps) => {
  const router = useRouter();
  const provider = params.provider as OAuthProvider;

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { code } = searchParams;
        if (!code) {
          throw new Error('인증 코드가 없습니다.');
        }

        const additionalParams = getAdditionalParams(provider, searchParams);

        const result = await handleSocialCallback(
          provider,
          code,
          additionalParams
        );

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
};

export default OAuthCallbackPage;

// 제공자별 추가 파라미터 처리
function getAdditionalParams(
  provider: OAuthProvider,
  searchParams: SearchParams
): OAuthCallbackParams {
  const { code } = searchParams;
  switch (provider) {
    case 'kakao':
    case 'naver':
      return {
        code: code!,
        state: searchParams.state,
      };
    case 'google':
      return {
        code: code!,
        scope: searchParams.scope,
      };
    default:
      return { code: code! };
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

  router.push(result.redirectUrl);
}
