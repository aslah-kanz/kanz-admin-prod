'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TBlog, TBlogDetail, TBlogRequest } from '@/types/blog.type';
import { TDefaultSearchParams } from '@/types/common.type';

/**
 * get blogs
 * @returns
 */
export const getBlogs = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TBlog>>(`/blogs`, {
    params,
  });

  return data.data;
};

/**
 * get blog by id
 * @param id
 * @returns
 */
export const getBlogById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TBlogDetail>>(`/blogs/${id}`);

  return data.data;
};

/**
 * Add blog
 * @param payload
 * @returns
 */
export const addBlog = async (payload: TBlogRequest) => {
  const { data } = await http.post<TApiResponse<TBlog>>('/blogs', payload);

  return data;
};

/**
 * Update blog
 * @param id
 * @param payload
 * @returns
 */
export const editBlog = async (id: number, payload: TBlogRequest) => {
  const { data } = await http.put<TApiResponse<TBlog>>(`/blogs/${id}`, payload);

  return data;
};

/**
 * Delete blog
 * @param id
 * @returns
 */
export const deleteBlog = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TBlog>>(`/blogs/${id}`);

  return data;
};
