import instance from '@/lib/axios';
import { FilteredUser, FilteredUsersResponse } from '@/types/member.type';

interface PaginationParams {
  page: number;
  limit: number;
}

// 로그인 필터된 회원목록 조회
export const fetchLoggedInFilteredUsers = async (filter: {
  region: string;
  minAge: number;
  maxAge: number;
  minLikeCount: number;
}): Promise<FilteredUser[]> => {
  const res = await instance.get<FilteredUsersResponse>(
    '/user-filter/filtered-list',
    {
      params: filter,
    }
  );
  return res.data.users;
};

// 비로그인 필터된 회원목록 조회
export const fetchPublicFilteredUsers = async (filter: {
  region: string;
  minAge: number;
  maxAge: number;
  minLikeCount: number;
}): Promise<FilteredUser[]> => {
  const res = await instance.get<{ users: FilteredUser[] }>(
    '/user-filter/public-filtered-list',
    {
      params: filter,
    }
  );
  return res.data.users;
};

// 로그인 회원목록 조회
export const fetchLoggedInUsers = async (
  params?: PaginationParams
): Promise<FilteredUser[]> => {
  const res = await instance.get('/user-filter/list', {
    params,
  });
  return res.data.users;
};

// 비로그인 회원목록 조회
export const fetchPublicUsers = async (
  params?: PaginationParams
): Promise<FilteredUser[]> => {
  const res = await instance.get('/user-filter/public-list', {
    params,
  });
  return res.data.users;
};
