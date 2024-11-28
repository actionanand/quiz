import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { QuizData } from './model/quiz-data';
import { QuestionsService } from './services/questions.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  //1. Set and initialize properties
  quizTitle = 'Quiz Time!';
  questionsToDisplay = 10;
  optionsBtn = 4;
  scoreNeededToPass = 5;
  islamicGreenColor = '#00b300';
  freeSpeechRedColor = '#cc0000';
  darkGoldenrodColor = '#cc7a00';
  suvaGreyColor = '#8c8c8c';
  trackQnCount = [...Array(this.questionsToDisplay)].map((e, i) => (i + 1)); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  buttons = [...Array(this.optionsBtn)].map((e, i) => (i + 1));
  questionCount = 0;
  score = 0;
  ans!: number;
  timedOut = 0;
  rand!: number;
  record = Array();
  status = 0;
  allQuestions!: string | any[];
   // ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  options = [...Array(this.optionsBtn)].map((e, i) => ('Option ' + (i + 1)));
  question!: string;
  defaultColor = '#e6f3ff'; // Alice Blue
  submit = 'Next Question';
  submitStyle = '';
  optionBg = false;
  trackerColor = [...Array(this.questionsToDisplay)].map((e, i) => (this.suvaGreyColor));
  isResultDisplay = false;
  progress = "Question " + (this.questionCount + 1) + " of 10";
  result = '';
  timerInit = false;

  countDown: any;
  timer = '00:00';
  secsInput = 30;
  secs = this.secsInput;

  unSub!: Subscription;

  // constructor(private req: QuestionsService, private cdr: ChangeDetectorRef) {}

  constructor(private qtnServ: QuestionsService) {}

  @ViewChild('timerEl') timerEl: any;
  ngAfterViewInit() {
    this.startTimer(this.timerEl.nativeElement);
    // this.cdr.detectChanges();
  }

  ngOnInit():void {
    this.onGettingQtnz();
  }

  ngOnDestroy(): void {
    if (this.unSub) {
      this.onUnSubscribing();
    }
  }

  onUnSubscribing() {
    this.unSub.unsubscribe();
  }

  onGettingQtnz() {
    //Fetch all the questions from the database
    this.unSub = this.qtnServ.getQuestions().subscribe((data: QuizData)=> {
      console.log(data.questions)
      // this.allQuestions = data; // if you're using fake server
      this.allQuestions = data.questions; // if you're using github server
      this.quizTitle = data['quiz-title'];
      //Once it has been fetched, within this function, initialize
     //Generate a random number from the total number of questions (make sure its 1 less than the total number (array))
     this.rand = Math.round(Math.random() * this.allQuestions.length);

     while(this.rand == this.allQuestions.length) {
        this.rand = Math.round(Math.random() * this.allQuestions.length);
     }
      //Set the record array to keep track of the numbers used to retrieve questions
      this.record[0] = this.rand;

      //Call the getQuestion method to access the question
      this.getQuestion(this.questionCount, this.rand);
      this.timerInit = true;

    });
  }


  //2. Load the first question into the app - get from database

  setQuestion(qCount:any, rand:any) {
    const ques = this.allQuestions[rand];
    this.question = (qCount + 1) + ". " + ques.question;
    for (let i = 0; i < this.optionsBtn; i++) {
      let optionItration = 'option' + (i + 1).toString();
      this.options[i] = ques[optionItration];
    }
    // this.options[0] = ques.option1;
    // this.options[1] = ques.option2;
    // this.options[2] = ques.option3;
    // this.options[3] = ques.option4;
  }

  getQuestion(qCount:number, rand:number) {
    if(qCount > 0) { //not the first question
      this.startTimer(this.timerEl.nativeElement);
    }
    if(qCount === this.questionsToDisplay - 1) { //last question
      this.submit = "Submit Test";
      this.submitStyle = this.islamicGreenColor;
    }

    if(qCount > this.questionsToDisplay - 1) {
      return;
    }

    this.trackerColor[this.questionCount] = this.darkGoldenrodColor;
    this.setQuestion(qCount, rand);
    this.defaultColor = '#e6f3ff'; //make sure the colors are back to normal for the options
  }


  optionSelect(e: any ) {
    this.optionBg = true;
    //set ans value based on the option selected ; it's PointerEvent
	  this.ans = parseInt(e.target.id.replace("option",""),10); // say, #option2 will become #2
  }

  randomGenerator() {
    while(this.status == 0) {
      this.rand = Math.round(Math.random() * this.allQuestions.length);
      if(this.rand !== this.allQuestions.length) {
        //run through record array to find if its unique
        for(let i=0; i < this.record.length; i++) {
          if(this.rand === this.record[i]) {
            break;
          }
          else if(i == this.record.length - 1) {
            this.record[this.questionCount] = this.rand;
            this.status = 1;
          }
        }
      }
    }
    this.status = 0;
    return this.rand;
  }

  setCorrect() {
    this.score++;
    this.trackerColor[this.questionCount] = this.islamicGreenColor;
  }

  setWrong() {
    this.trackerColor[this.questionCount] = this.freeSpeechRedColor;
  }

  finalScore() {
    if(this.score > this.scoreNeededToPass) {
      this.result = "Congrats! You passed! \n Your score is " + this.score + "!";
    }
    else {
      this.result = "Sorry. You failed. \n Your score is " + this.score + "!";
    }
  }

  setResultPage() {
    this.isResultDisplay = true;
    this.progress = 'Quiz Completed';
    this.finalScore();
    this.timer = '00:00'
  }

  nextQuestion() {
    this.optionBg = false; //so all colors go to normal default color
    if(this.secs != -1) {
      clearTimeout(this.countDown);
    }
    this.secs = this.secsInput;
    this.timer = "00:" + this.secs;
    //last question
    if(this.questionCount == this.questionsToDisplay - 1) {
			if(this.ans == this.allQuestions[this.rand].answer) {
				this.setCorrect();
			}
			else {
				this.setWrong();
			}
			this.setResultPage();
			return;
		}

		if(this.ans == this.allQuestions[this.rand].answer) {
			this.setCorrect();
		}
		else {
			this.setWrong();
		}

    this.getQuestion(++this.questionCount, this.randomGenerator());
    this.progress = "Question " + (this.questionCount+1) + " of 10";
    this.ans = NaN;
  }

  retakeTest() {
    // window.location.reload();
    this.onUnSubscribing();
    this.optionBg = false;
    if(this.secs != -1) {
      clearTimeout(this.countDown);
    }
    this.secs = this.secsInput;
    this.timer = "00:" + this.secs;
    this.questionCount = 0;
    this.score = 0;
    this.timedOut = 0;
    this.record.length = 0;
    this.status = 0;
    this.defaultColor = '#e6f3ff';
    this.submit = 'Next Question';
    this.submitStyle = '';
    this.trackerColor = [...Array(10)].map((e, i) => (this.suvaGreyColor));
    this.isResultDisplay = false;
    this.progress = "Question " + (this.questionCount + 1) + " of 10";
    this.result = '';
    this.timerInit = false;
    this.timer = '00:00';
    this.secsInput = 30;
    this.secs = this.secsInput;
    this.ans = NaN;
    this.onGettingQtnz();
    this.startTimer(this.timerEl.nativeElement);
  }

  startTimer(e: any) {
    this.countDown = setTimeout(() => {
      this.timer = "00:" + this.secs;
      this.secs--;
      if(this.secs < 0) {
        clearTimeout(this.countDown);
        // console.log("counddown" + this.countDown);
        this.secs =  this.secsInput;
        this.nextQuestion();
        return;
      }
      this.startTimer(this.timerEl.nativeElement);
    },1000);
  }

  // n == (questionCount + 1) ? this.darkGoldenrodColor : this.suvaGreyColor
  //Tracker color function
  // [style.background-color]="n == questionCount ? trackerColor : this.suvaGreyColor"
}