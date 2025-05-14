import { OAuthProvider } from '@/types/oauth.type';
import OAuthCallback from '@/components/page/login/OAuthCallback';

interface OAuthCallbackPageProps {
  params: { provider: string };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function OAuthCallbackPage({
  params,
  searchParams,
}: OAuthCallbackPageProps) {
  const provider = params.provider as OAuthProvider;
  const code =
    typeof searchParams.code === 'string' ? searchParams.code : undefined;
  const state =
    typeof searchParams.state === 'string' ? searchParams.state : undefined;
  const scope =
    typeof searchParams.scope === 'string' ? searchParams.scope : undefined;

  return (
    <OAuthCallback
      provider={provider}
      code={code}
      state={state}
      scope={scope}
    />
  );
}
