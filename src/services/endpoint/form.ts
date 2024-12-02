import api from '../apiForm'; 

interface FormElement {
    id: number;
    type: 'text' | 'textarea' | 'radio' | 'checkbox';
    question: string;
    options: string[];
    required: boolean;
    description: string;
  }
  
  interface FormPage {
    id: number;
    elements: FormElement[];
  }

  interface Form {
    id: string;
    title: string;
    createdAt: Date;
    responsesCount: number;
  }
  

  export const getForms = async () => {
    try {
      const response = await api.get<Form[]>('/api/forms/my-forms');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar formulários:', error);
      alert('Erro ao buscar os formulários. Confira o console para mais detalhes.');
      throw error;
    }
  };
  
  export const createForm = async (pages: FormPage[], title: string, description: string) => {
    const formDTO = {
        title,
        description,
        questions: pages.flatMap(page =>
          page.elements.map(element => ({
            text: element.question,
            type: element.type,
          }))
        ),
      };
    
      try {
        const response = await api.post('/api/forms', formDTO);
        alert('Formulário salvo com sucesso!');
        return response.data;
      } catch (error) {
        console.error('Erro ao salvar o formulário:', error);
        alert('Erro ao salvar o formulário. Confira o console para mais detalhes.');
        throw error;
      }
  };
  
