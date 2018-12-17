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
    var defense1Answer = Data.effectiveness[(attackIndex * Data.types.length) + defense1Index];
    var defense2Answer;

    this.correctAnswer = defense1Answer;

    if (this.dualTypeQuestion) {
      var defense2Index = Data.types.indexOf(this.defenseType2);
      defense2Answer = Data.effectiveness[(attackIndex * Data.types.length) + defense2Index];
      this.correctAnswer = this.correctAnswer * defense2Answer;
    }

    // GO conversion
    if (this.correctAnswer == 0) {
      this.correctAnswer = 0.39;

      // Account for resistance & immunity
      if (this.dualTypeQuestion) {
        if ((defense1Answer == 0 && defense2Answer == 0.5) || (defense1Answer == 0.5 && defense2Answer == 0)) {
          this.correctAnswer = 0.24;
        }
      }
    } else if (this.correctAnswer == 0.25) {
      this.correctAnswer = 0.39;
    } else if (this.correctAnswer == 0.5) {
      this.correctAnswer = 0.625;
    } else if (this.correctAnswer == 2) {
      this.correctAnswer = 1.6;
    } else if (this.correctAnswer == 4) {
      this.correctAnswer = 2.56;
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
