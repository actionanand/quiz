export interface QuizData {
  'quiz-title': string,
  options: number,
  'questions-to-display': number,
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