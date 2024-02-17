// Constants
const dateField = document.querySelector("#date");
const currentDate = new Date();
const date = currentDate.toLocaleDateString();
const lastDigit = currentDate.getDate() % 10;

const buttons = document.querySelectorAll("button");
const subject = document.querySelector("#subject");

const correctScore = document.querySelector("#correct");
const incorrectScore = document.querySelector("#incorrect");
const points = document.querySelector("#points");

const questionNum = document.querySelector("#question-number");
const questionText = document.querySelector("#question-text");
const questionBody = document.querySelector("#question-body");

// Variables
let gameStarted = false;
let currentQuestion = 0;
let currentTopic = lastDigit;
let timeoutID;

// Functions
const nextQuestion = () => {
  currentQuestion++;
  //eslint-disable-next-line
  if (currentQuestion >= questions[currentTopic].length) {
    gameStarted = false;
    // stopGame();
  } else {
    setQuestion(questions[currentTopic], currentQuestion); //eslint-disable-line
  }
};

const updateScore = (correct) => {
  if (correct) {
    correctScore.textContent++;
    points.textContent++;
  } else {
    incorrectScore.textContent++;
  }
  nextQuestion();
};

const evaluateAnswer = (answer, correct) => {
  if (!gameStarted) {
    return undefined;
  }

  if (answer === null) {
    return false;
  }

  if (Array.isArray(answer)) {
    if (answer.length !== correct.length) {
      return false;
    }
    for (let i = 0; i < answer.length; i++) {
      if (!correct.includes(answer[i])) {
        return false;
      }
    }
    correctScore.textContent++;
  } else {
    if (answer.toLowerCase() !== correct.toLowerCase()) {
      return false;
    }
  }
  return true;
};

const setQuestion = (questionSet, index) => {
  const question = questionSet[index];
  questionNum.textContent = `${question.id}/${questionSet.length}`;
  questionText.textContent = question.title;
  questionBody.innerHTML = "";

  const submit = document.createElement("button");
  submit.setAttribute("type", "submit");
  const text = document.createElement("span");
  text.textContent = "Submit";
  submit.appendChild(text);

  if (question.type === "text-input") {
    const input = document.createElement("input");
    input.setAttribute("id", "text-answer");
    questionBody.appendChild(input);
    submit.addEventListener("click", (e) => {
      e.preventDefault();
      clearTimeout(timeoutID);
      if (gameStarted) {
        updateScore(evaluateAnswer(input.value, question.correct));
      }
    });
  }
  if (question.type === "selection") {
    question.body.forEach((option) => {
      const input = document.createElement("input");
      const label = document.createElement("label");
      label.textContent = option;
      input.setAttribute("type", "radio");
      input.setAttribute("name", "answer");
      input.setAttribute("value", option);
      label.appendChild(input);
      questionBody.appendChild(label);
    });
    submit.addEventListener("click", (e) => {
      e.preventDefault();
      clearTimeout(timeoutID);
      if (gameStarted) {
        const checkedRadioButton = questionBody.querySelector(
          "input[name=answer]:checked",
        );
        let selectedValue;
        if (checkedRadioButton) {
          selectedValue = checkedRadioButton.value;
        } else {
          selectedValue = null;
        }
        updateScore(evaluateAnswer(selectedValue, question.correct));
      }
    });
  }
  if (question.type === "checkbox") {
    question.body.forEach((option) => {
      const input = document.createElement("input");
      const label = document.createElement("label");
      label.textContent = option;
      input.setAttribute("type", "checkbox");
      input.setAttribute("name", "answer");
      input.setAttribute("value", option);
      label.appendChild(input);
      questionBody.appendChild(label);
    });
    submit.addEventListener("click", (e) => {
      e.preventDefault();
      clearTimeout(timeoutID);
      const checked = [];
      questionBody
        .querySelectorAll("input[name=answer]:checked")
        .forEach((input) => {
          checked.push(input.value);
        });
      if (gameStarted) {
        updateScore(evaluateAnswer(checked, question.correct));
      }
    });
  }

  timeoutID = setTimeout(() => {
    submit.style.animation = "none";
    nextQuestion();
  }, 3000);

  questionBody.appendChild(submit);
};

const triggerClick = (button) => {
  switch (button) {
    case "Start":
      if (!gameStarted) {
        gameStarted = true;
        currentQuestion = 0;
        setQuestion(questions[currentTopic], currentQuestion); //eslint-disable-line
      }
      break;

    case "Stop":
      if (gameStarted) {
        gameStarted = false;
        currentQuestion = 0;
        // stopGame();
      }
      break;

    case "Skip":
      if (gameStarted) {
        points.textContent--;
        clearTimeout(timeoutID);
        nextQuestion();
      }
      break;
  }
};

// Initialization
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    triggerClick(button.textContent);
  });
});

dateField.textContent = `Today's date: ${date}`;
subject.textContent = questions[currentTopic][0].topic; //eslint-disable-line
