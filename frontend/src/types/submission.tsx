export interface SubmissionError {
  general?: string;
  network?: string;
  validation?: string;
}

export interface ImageError {
  mainImage?: string;
  additionalImages?: string;
}
