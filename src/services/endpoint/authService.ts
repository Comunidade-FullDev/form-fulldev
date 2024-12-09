import { error } from 'console';
import api from '../apiForm';
import Cookies from "js-cookie";


export interface AuthDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
}

export const login = async (authData: AuthDTO): Promise<String> => {
  try{
  const response = await api.post<LoginResponseDTO>('/auth/login', authData);
  Cookies.set("token", response.data.token)
  return "login efetuado com sucesso";
  }catch(error){
    throw error;
  }
};

export const register = async (registerData: RegisterDTO): Promise<string> => {
  try{
  const response = await api.post<string>('/auth/register', registerData);
  return response.data;
  }catch(error){
    throw error;
  }
};

export const verifyUser = async (token: string): Promise<string> => {
  try{
  const response = await api.get<string>(`/auth/verify?token=${token}`);
  return response.data;
  }catch(error){
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<string> => {
  try{
  const response = await api.delete<string>(`/auth/delete/${id}`);
  return response.data;
  }catch(error){
    throw error;
  }
};