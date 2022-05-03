import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http : HttpClient) { }

  getQuestions() {
    // const url = 'http://localhost:3000/questions';
    const url = '/questions';
    // const url = 'https://3000-actionanand-quiz-v04ja8xzwqf.ws-us43.gitpod.io/questions';

    return this.http.get(url);
  }
}
