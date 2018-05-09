import { Component, OnInit } from "@angular/core";

import { Data } from "./shared/data";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  streak = 0;
  dualTypeQuestion;
  attackType = Data.types[0];
  defenseType1 = Data.types[0];
  defenseType2 = Data.types[0];
  userAnswer;
  correctAnswer;
  message = "";
  uiDisabled = false;
  countdown = 5;

  ngOnInit() {
    this.newQuestion();
  }

  newQuestion() {
    this.dualTypeQuestion = Math.floor(Math.random() * 3) === 0;
    this.attackType = Data.types[Math.floor(Math.random() * Data.types.length)];
    this.defenseType1 = Data.types[Math.floor(Math.random() * Data.types.length)];
    this.defenseType2 = Data.types[Math.floor(Math.random() * Data.types.length)];
  }

  checkAnswer(args) {
    if (this.uiDisabled) {
      return;
    }

    this.userAnswer = parseFloat(args.target.getAttribute("data-answer"));

    var attackIndex = Data.types.indexOf(this.attackType);
    var defense1Index = Data.types.indexOf(this.defenseType1);

    this.correctAnswer = Data.effectiveness[(attackIndex * Data.types.length) + defense1Index];

    if (this.dualTypeQuestion) {
      var defense2Index = Data.types.indexOf(this.defenseType2);
      this.correctAnswer = this.correctAnswer *
        Data.effectiveness[(attackIndex * Data.types.length) + defense2Index];
    }

    if (this.userAnswer === this.correctAnswer) {
      this.streak++;
      this.message = "Correct! New question in " + this.countdown + "...";
    } else {
      this.streak = 0;
      this.message = "Incorrect. New question in " + this.countdown + "...";
    }

    this.uiDisabled = true;

    var interval = setInterval(() => {
      this.countdown--;
      this.message = this.message.replace(/[0-9]/, this.countdown.toString());
      if (this.countdown == 1) {
        clearInterval(interval);
      }
    }, 1000);

    setTimeout(() => {
      this.message = "";
      this.uiDisabled = false;
      this.userAnswer = null;
      this.correctAnswer = null;
      this.countdown = 5;
      this.newQuestion();
    }, 5000);
  }

  determineButtonClass(buttonValue) {
    if (buttonValue == this.userAnswer) {
      return this.userAnswer == this.correctAnswer ?
        "correct" : "incorrect";
    }
    if (buttonValue == this.correctAnswer) {
      return "correct";
    }
  }
}
