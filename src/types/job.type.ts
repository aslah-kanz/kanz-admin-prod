import { TLocale, TLocaleRequest, TMeta, TMetaRequest } from './common.type';
import { TDocument } from './document.type';

export type TJobSummary = {
  requested: number;
  processed: number;
  completed: number;
};

export type TJobField = {
  id: number;
  code: string;
  name: TLocale;
};

export type TJob = TMeta & {
  id: number;
  code: string;
  title: TLocale;
  slug: string;
  responsibility: TLocale;
  requirement: string;
  jobType: TLocale;
  experience: TLocale;
  jobLocation: TLocale;
  jobField: TJobField;
  summary: TJobSummary;
  status: string;
  jobDate: Date;
};

export type TJobDetail = TJob;

export type TApplicant = {
  id: number;
  name: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  job: TJob;
  document: TDocument;
  applyDate: Date;
  status: string;
};

export type TJobFieldRequest = {
  name: TLocaleRequest;
};

export type TApplicantDetail = TApplicant;

export type TJobRequest = TMetaRequest & {
  title: TLocaleRequest;
  slug: string;
  responsibility: TLocaleRequest;
  requirement: string;
  jobType: TLocaleRequest;
  experience: TLocaleRequest;
  jobLocation: TLocaleRequest;
  jobFieldId: number;
  status: string;
};
