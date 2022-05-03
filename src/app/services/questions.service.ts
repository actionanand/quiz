import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class QuestionsService {

  constructor(private http : HttpClient) { }

  getQuestions() {
    // const url = 'http://localhost:3000/questions'; // for fake server
    const url = 'https://raw.githubusercontent.com/actionanand/json-server/main/db/api/quiz/questions.json';

    return this.http.get(url);
  }
}
