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

  const response = await api.post<LoginResponseDTO>('/auth/login', authData);
  Cookies.set("token", response.data.token, { expires: 1})
  
  return "login efetuado com sucesso";
};

export const register = async (registerData: RegisterDTO): Promise<string> => {
  const response = await api.post<string>('/auth/register', registerData);
  return response.data;
};

export const verifyUser = async (token: string): Promise<string> => {
  const response = await api.get<string>(`/auth/verify?token=${token}`);
  return response.data;
};

export const deleteUser = async (id: string): Promise<string> => {
  const response = await api.delete<string>(`/auth/delete/${id}`);
  return response.data;
};