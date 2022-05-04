export interface QuizData {
  questions: [
    {
      id: number;
      question: string;
      option1: string;
      option2: string;
      option3: string;
      option4: string;
      answer: number;
    }
  ]
}