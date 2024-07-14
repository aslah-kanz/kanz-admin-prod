import {
  ApiServiceErr,
  MutOpt,
  TApiResponse,
  TResponsePaginate,
} from '@/types/api.type';
import { TDefaultSearchParams } from '@/types/common.type';
import {
  TApplicant,
  TJob,
  TJobField,
  TJobFieldRequest,
  TJobRequest,
} from '@/types/job.type';
import { QueryObserverOptions, useMutation, useQuery } from 'react-query';
import {
  addJob,
  addJobField,
  approveApplicant,
  deleteJob,
  deleteJobField,
  editJob,
  editJobField,
  getApplicantsByJobId,
  getJobApplicantById,
  getJobApplicants,
  getJobById,
  getJobFields,
  getJobs,
  rejectApplicant,
} from './http/job.service';

/**
 * Get jobs
 * @param opt
 * @returns
 */
export const useGetJobs = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TResponsePaginate<TJob>>,
) => {
  return useQuery<TResponsePaginate<TJob>, ApiServiceErr>(
    ['jobs', params],
    () => getJobs(params),
    opt,
  );
};

/**
 * Get job by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetJobById = (id: number, opt?: QueryObserverOptions<TJob>) => {
  return useQuery<TJob, ApiServiceErr>(
    ['jobs', { id }],
    () => getJobById(id),
    opt,
  );
};

/**
 * Add job
 * @param opt
 * @returns
 */
export const useAddJob = (opt?: MutOpt<TApiResponse<TJob>>) => {
  return useMutation<TApiResponse<TJob>, ApiServiceErr, TJobRequest>(
    async (payload) => {
      const resp = await addJob(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Update job
 * @param opt
 * @returns
 */
export const useEditJob = (opt?: MutOpt<TApiResponse<TJob>>) => {
  return useMutation<
    TApiResponse<TJob>,
    ApiServiceErr,
    { id: number; payload: TJobRequest }
  >(async ({ id, payload }) => {
    const resp = await editJob(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete job
 * @param opt
 * @returns
 */
export const useDeleteJob = (opt?: MutOpt<TApiResponse<TJob>>) => {
  return useMutation<TApiResponse<TJob>, ApiServiceErr, number>(async (id) => {
    const resp = await deleteJob(id);
    return resp;
  }, opt);
};

/**
 * Get job fields
 * @param opt
 * @returns
 */
export const useGetJobFields = (
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<Array<TJobField>>,
) => {
  return useQuery<Array<TJobField>, ApiServiceErr>(
    ['job-fields', params],
    () => getJobFields(params),
    opt,
  );
};

/**
 * Add job field
 * @param opt
 * @returns
 */
export const useAddJobField = (opt?: MutOpt<TApiResponse<TJobField>>) => {
  return useMutation<TApiResponse<TJobField>, ApiServiceErr, TJobFieldRequest>(
    async (payload) => {
      const resp = await addJobField(payload);
      return resp;
    },
    opt,
  );
};

/**
 * Update job field
 * @param opt
 * @returns
 */
export const useEditJobField = (opt?: MutOpt<TApiResponse<TJobField>>) => {
  return useMutation<
    TApiResponse<TJobField>,
    ApiServiceErr,
    { id: number; payload: TJobFieldRequest }
  >(async ({ id, payload }) => {
    const resp = await editJobField(id, payload);
    return resp;
  }, opt);
};

/**
 * Delete job field
 * @param opt
 * @returns
 */
export const useDeleteJobField = (opt?: MutOpt<TApiResponse<TJobField>>) => {
  return useMutation<TApiResponse<TJobField>, ApiServiceErr, number>(
    async (id) => {
      const resp = await deleteJobField(id);
      return resp;
    },
    opt,
  );
};

/**
 * Get job applicants
 * @param opt
 * @returns
 */
export const useGetJobApplicants = (
  opt?: QueryObserverOptions<TResponsePaginate<TApplicant>>,
) => {
  return useQuery<TResponsePaginate<TApplicant>, ApiServiceErr>(
    ['job-applicants'],
    () => getJobApplicants(),
    opt,
  );
};

/**
 * Get job applicant by id
 * @param id
 * @param opt
 * @returns
 */
export const useGetJobApplicantById = (
  id: number,
  opt?: QueryObserverOptions<TResponsePaginate<TApplicant>>,
) => {
  return useQuery<TResponsePaginate<TApplicant>, ApiServiceErr>(
    ['job-applicants', { id }],
    () => getJobApplicantById(id),
    opt,
  );
};

/**
 * Approve job applicant
 * @param opt
 * @returns
 */
export const useApproveApplicant = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(async (id) => {
    const resp = await approveApplicant(id);
    return resp;
  }, opt);
};

/**
 * Reject job applicant
 * @param opt
 * @returns
 */
export const useRejectApplicant = (opt?: MutOpt<TApiResponse<{}>>) => {
  return useMutation<TApiResponse<{}>, ApiServiceErr, number>(async (id) => {
    const resp = await rejectApplicant(id);
    return resp;
  }, opt);
};

/**
 * Get job applicants by job id
 * @param id
 * @param opt
 * @returns
 */
export const useGetApplicantsByJobId = (
  id: number,
  params?: TDefaultSearchParams,
  opt?: QueryObserverOptions<TApplicant[]>,
) => {
  return useQuery<TApplicant[], ApiServiceErr>(
    ['job-applicants', { id }, params],
    () => getApplicantsByJobId(id, params),
    opt,
  );
};
