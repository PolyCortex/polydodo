import { SERVER_URL } from './constants';
import Axios from 'axios-observable';

const objectToFormData = (obj) => {
  const formData = new FormData();
  for (const key in obj) {
    formData.append(key, obj[key]);
  }
  return formData;
};

export const analyzeSleep = (formData) =>
  Axios.post(`${SERVER_URL}/analyze_sleep`, objectToFormData(formData), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
