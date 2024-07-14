'use server';

import http from '@/lib/axios-instance';
import { TApiResponse, TApiResponsePaginate } from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TApplicant,
  TJob,
  TJobField,
  TJobFieldRequest,
  TJobRequest,
} from '@/types/job.type';

/**
 * Get jobs
 * @returns
 */
export const getJobs = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponsePaginate<TJob>>(`/jobs`, {
    params,
  });

  return data.data;
};

/**
 * Get job by id
 * @param id
 * @returns
 */
export const getJobById = async (id: number) => {
  const { data } = await http.get<TApiResponse<TJob>>(`/jobs/${id}`);

  return data.data;
};

/**
 * Add job
 * @param payload
 * @returns
 */
export const addJob = async (payload: TJobRequest) => {
  const { data } = await http.post<TApiResponse<TJob>>('/jobs', payload);

  return data;
};

/**
 * Update job
 * @param id
 * @param payload
 * @returns
 */
export const editJob = async (id: number, payload: TJobRequest) => {
  const { data } = await http.put<TApiResponse<TJob>>(`/jobs/${id}`, payload);

  return data;
};

/**
 * Delete job
 * @param id
 * @returns
 */
export const deleteJob = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TJob>>(`/jobs/${id}`);

  return data;
};

/**
 * Get job fields
 * @returns
 */
export const getJobFields = async (params?: TDefaultSearchParams) => {
  const { data } = await http.get<TApiResponse<Array<TJobField>>>(
    '/job-fields',
    { params },
  );
  return data.data;
};

/**
 * Add job field
 * @param name
 * @returns
 */
export const addJobField = async (payload: TJobFieldRequest) => {
  const { data } = await http.post<TApiResponse<TJobField>>(
    '/job-fields',
    payload,
  );

  return data;
};

/**
 * Edit job field
 * @param id
 * @param name
 * @returns
 */
export const editJobField = async (id: number, payload: TJobFieldRequest) => {
  const { data } = await http.put<TApiResponse<TJobField>>(
    `/job-fields/${id}`,
    payload,
  );

  return data;
};

/**
 * Delete job field
 * @param id
 * @returns
 */
export const deleteJobField = async (id: number) => {
  const { data } = await http.delete<TApiResponse<TJobField>>(
    `/job-fields/${id}`,
  );

  return data;
};

/**
 * Get job applicants
 * @returns
 */
export const getJobApplicants = async () => {
  const { data } =
    await http.get<TApiResponsePaginate<TApplicant>>('/jobapplicants');

  return data.data;
};

/**
 * Get job applicant by id
 * @param id
 * @returns
 */
export const getJobApplicantById = async (id: number) => {
  const { data } = await http.get<TApiResponsePaginate<TApplicant>>(
    `/jobapplicants/${id}`,
  );

  return data.data;
};

/**
 * Approve job applicant
 * @returns
 */
export const approveApplicant = async (id: number) => {
  const { data } = await http.post<TApiResponse<TApplicant>>(
    `/jobapplicants/${id}/approve`,
  );

  return data;
};
/**
 * Reject job applicant
 * @returns
 */
export const rejectApplicant = async (id: number) => {
  const { data } = await http.post<TApiResponse<TApplicant>>(
    `/jobapplicants/${id}/reject`,
  );

  return data;
};

/**
 * Get applicants by job id
 * @param id
 * @returns
 */
export const getApplicantsByJobId = async (
  id: number,
  params?: TDefaultSearchParams,
) => {
  const { data } = await http.get<TApiResponse<TApplicant[]>>(
    `/jobs/${id}/applicants`,
    { params },
  );

  return data.data;
};
