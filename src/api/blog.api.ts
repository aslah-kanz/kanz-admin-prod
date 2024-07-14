import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import { TBlog, TBlogRequest } from '@/types/blog.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  addBlog,
  deleteBlog,
  editBlog,
  getBlogById,
  getBlogs,
} from './http/blog.service';

/**
 * Get blogs
 * @param opt
 * @returns
 */
export const useGetBlogs = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TBlog>>,
) => {
  return useQuery<TResponsePaginate<TBlog>, ApiServiceErr>(
    ['blogs', params],
    () => getBlogs(params),
    opt,
  );
};

/**
 * Get blog by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetBlogById = (
  id: number,
  opt?: QueryObserverOptions<TBlog>,
) => {
  return useQuery<TBlog, ApiServiceErr>(
    ['blogs', { id }],
    () => getBlogById(id),
    opt,
  );
};

/**
 * Add blog
 * @param opt
 * @returns
 */
export const useAddBlog = (opt?: MutOpt<TApiResponse<TBlog>>) => {
  return useMutation<TApiResponse<TBlog>, ApiServiceErr, TBlogRequest>(
    async (payload) => {
      const resp = await addBlog(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Update blog
 * @param opt
 * @returns
 */
export const useEditBlog = (opt?: MutOpt<TApiResponse<TBlog>>) => {
  return useMutation<
    TApiResponse<TBlog>,
    ApiServiceErr,
    { id: number; payload: TBlogRequest }
  >(async ({ id, payload }) => {
    const resp = await editBlog(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete blog
 * @param opt
 * @returns
 */
export const useDeleteBlog = (opt?: MutOpt<TApiResponse<TBlog>>) => {
  return useMutation<TApiResponse<TBlog>, ApiServiceErr, number>(async (id) => {
    const resp = await deleteBlog(id);
    return resp;
  }, opt);
};
