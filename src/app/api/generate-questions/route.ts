// src/app/api/generate-questions/route.ts

import { NextResponse } from 'next/server';

interface Question {
  id: number;
  question: string;
  options: string[];
}

export async function POST(req: Request) {
    try {
      console.log("entrou na chamada")
        const { topic, questionCount } = await req.json();

        const questions = await generateQuestions(topic, questionCount);

        return NextResponse.json(questions);
    } catch (error) {
        return NextResponse.json({ error: 'Falha ao gerar as perguntas' }, { status: 500 });
    }
}

const generateQuestions = async (topic: string, questionCount: number): Promise<Question[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_GENERATE_QUESTIONS_URL || ""
    const apiKey = process.env.NEXT_API_KEY_GENERATE_QUESTIONS

    const requestData = {
        model: 'llama3-70b-8192',
        messages: [
            {
                role: 'user',
                content: `Gere ${questionCount} questões para o tópico em portugues: ${topic}. Algumas questões devem ser de múltipla escolha e outras de resposta aberta. Quando for de múltipla escolha,
                 forneça as alternativas de forma clara e separada, para que elas sejam agrupadas na mesma questão. Traga as questões direto sem dizer mais nada, vá direto para elas.
                 as questoes devem ser voltadas para o topico digitado. Se no texto houver solicitando tal tipo de questão, você deve apenas seguir o que ele falou sem exatamente falar o que ele solicitou 
                 GERAR EM PORTUGUES, JAMAIS GERAR EM INGLES`
            }
        ]
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestData),
    });

    console.log(response)

    if (!response.ok) {
        throw new Error('Erro ao buscar dados da API Groq');
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
      throw new Error('Nenhuma pergunta gerada pela API');
  }

    const questions: Question[] = [];
    let currentQuestion: Question | null = null;
  
    try {
      data.choices[0].message.content.split('\n').forEach((line: string) => {
        const trimmedLine = line.trim();
        const lineType = identifyLineType(trimmedLine);
  
        switch (lineType) {
          case 'question':
            if (currentQuestion) {
              questions.push(currentQuestion);
            }
            currentQuestion = {
              id: questions.length + 1,
              question: trimmedLine.substring(3),
              options: []
            };
            break;
          case 'option':
            if (currentQuestion) {
              currentQuestion.options.push(trimmedLine.substring(3));
            }
            break;
        }
      });

      console.log(questions)
  
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
  
      return questions;
    } catch (error) {
      throw new Error('Falha ao gerar as perguntas');
    }
  };
  
  function identifyLineType(line: string): 'question' | 'option' | 'other' {
    if (/^\d+\.\s/.test(line)) { 
        return 'question';
    } else if (/^[A-Da-d]\)\s/.test(line)) { 
        return 'option';
    } else {
        return 'other';
    }
}
