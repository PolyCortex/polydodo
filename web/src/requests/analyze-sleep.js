import { SERVER_URL } from './constants';
import Axios from 'axios-observable';
import { objectToFormData } from './object-to-formdata';

export const analyzeSleep = (formData) =>
  Axios.post(`${SERVER_URL}/analyze_sleep`, objectToFormData(formData), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
