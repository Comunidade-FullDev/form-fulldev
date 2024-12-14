import { CreateForm, FormWorkspace, AnswerDTO, FormDTO, FormPage, Form, AnswerGraphDTO, FormGraph } from '@/types/Form';
import api from '../apiForm';

export const getFormAnswers = async (formId: string): Promise<AnswerGraphDTO[]> => {
  try {
    const response = await api.get<AnswerGraphDTO[]>(`/api/forms/${formId}/answers`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar as respostas:', error);
    throw error;
  }
}

export const getFormByIdToGraph = async (id: string): Promise<FormGraph> => {
  try {
    const response = await api.get<FormGraph>(`/api/forms/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar o formulário com ID ${id}:`, error);
    throw error;
  }
}


export const updateDefaultFormSettings = async (standard: string, password: string, sendEmail: boolean) => {
  try {
      const payload = { password, sendEmail };
      console.log({ standard, ...payload });
      const response = await api.patch(`/api/forms/default-settings/${standard}`, payload);
      return response.data;
  } catch (error) {
      console.error("Erro ao atualizar as configurações padrão dos formulários:", error);
      throw error;
  }
}

export const getMyPublicsForms = async (): Promise<FormWorkspace[]> =>{
  try{
    const response = await api.get<FormWorkspace[]>(`/api/forms/my-forms/public`)
    return response.data
  }catch(error){
    console.error("Erro ao publicar formulário", error)
    throw error;
  }
}

export const publishFormById = async (id: number) => {
  try{
    const response = await api.patch(`/api/forms/${id}/publish`)
    return response.data
  }catch(error){
    console.error("Erro ao publicar formulário", error)
    throw error;
  }
}

export const submitAnswers = async (formId: string, answers: AnswerDTO[]) => {
  try {
    const response = await api.post(`/api/forms/${formId}/answers`, answers);
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar as respostas:', error);
    throw error;
  }
};

export const getPublicForm = async (idPublic: string, formHasLoginType: string, password: string): Promise<CreateForm> => {
  try {
    const response = await api.get<CreateForm>(`/api/forms/public/${formHasLoginType}/${idPublic}`, {
      params: { password }  
    });
    return response.data
  } catch (error) {
      throw error;
  }
}

export const deleteForm = async (id: number) => {
  try {
    const response = await api.delete(`/api/forms/${id}`)
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar formulário ', error);
    throw error;
  }
}

export const updateForm = async (id: number, formDTO: FormDTO) => {
  try {
    const response = await api.put(`/api/forms/${id}`, formDTO);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar o formulário:', error);
    throw error;
  }
};

export const getFormById = async (id: number): Promise<CreateForm> => {
  try {
    const response = await api.get<CreateForm>(`/api/forms/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar o formulário com ID ${id}:`, error);
    throw error;
  }
};

export const getForms = async () => {
  try {
    const response = await api.get<Form[]>('/api/forms/my-forms');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar formulários:', error);
    throw error;
  }
};

export const createForm = async (pages: FormPage[], title: string, description: string) => {
  const formDTO = {
    title,
    description,
    questions: pages.flatMap(page =>
      page.elements.map(element => ({
        title: element.question,
        type: element.type,
        questionDescription: element.questionDescription, 
        options: element.options
      }))
    ),
  };

  try {
    const response = await api.post('/api/forms', formDTO);
    return response.data;
  } catch (error) {
    console.error('Erro ao salvar o formulário:', error);
    throw error;
  }
};
