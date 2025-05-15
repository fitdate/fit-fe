import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SocialSignUpFormValues } from '@/types/social.type';
import { toast } from 'react-toastify';
import { socialSignUp } from '@/services/socialSignUp';

export const useSocialSignUpMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SocialSignUpFormValues) => socialSignUp(data),
    onSuccess: () => {
      toast.success('소셜 회원가입이 완료되었습니다!');
      router.push('/home');
    },
    onError: (error) => {
      toast.error(error.message || '소셜 회원가입에 실패했습니다.');
    },
  });
};
