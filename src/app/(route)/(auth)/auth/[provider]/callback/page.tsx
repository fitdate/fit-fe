'use client';

import { OAuthProvider } from '@/types/oauth.type';
import OAuthCallback from '@/components/page/callback/OAuthCallback';

interface Props {
  params: {
    provider: string;
  };
  searchParams: {
    code?: string;
    state?: string;
    scope?: string;
  };
}

export default function OAuthCallbackPage({ params, searchParams }: Props) {
  const { provider } = params;

  console.log('소셜 로그인 콜백 페이지:', {
    provider,
    searchParams,
  });

  const code = searchParams.code;
  const state = searchParams.state;
  const scope = searchParams.scope;

  console.log('파싱된 파라미터:', { code, state, scope });

  return (
    <div className="w-full h-[calc(100vh-160px)] flex items-center justify-center">
      <OAuthCallback
        provider={provider as OAuthProvider}
        code={code}
        state={state}
        scope={scope}
      />
    </div>
  );
}
