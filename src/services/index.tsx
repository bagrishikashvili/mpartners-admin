import { map } from "lodash";
import { axiosInstance } from "./axios";
import MainAxiosInstance from './mainAxios';
import axios from 'axios';

export async function LoginService(email: string, password: string) {
  return await  axiosInstance.post(`/login`, {
    email,
    password
  });
}

export async function getCurrentUser() {
  return await axiosInstance.get(`/me`);
}

