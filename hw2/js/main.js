// Constants
const dateField = document.querySelector("#date");
const currentDate = new Date();
const date = currentDate.toLocaleDateString();
const lastDigit = currentDate.getDate() % 10;

const buttons = document.querySelectorAll("button");
const subject = document.querySelector("#subject");

const correctScore = document.querySelector("#correct");
const incorrectScore = document.querySelector("#incorrect");

const questionNum = document.querySelector("#question-number");
const questionText = document.querySelector("#question-text");
const questionBody = document.querySelector("#question-body");

// Variables
let gameStarted = false;
let currentQuestion = 0;
let currentTopic = lastDigit;
let timeoutID;
let timeout = false;
let evaluated = false;
let questionsToAsk;
let currentAnswer;
let correctAnswer;

// Functions

// This function is responsible for stopping the game.
// It clears the timeout, updates the submit button text to indicate the game is stopped,
// and displays a message with game statistics.
// Users can then select a new subject or exit the game.
const stopGame = () => {
  clearTimeout(timeoutID);
  const submit = document.querySelector("#submitButton");
  submit.classList.add("pause");
  submit.textContent = "Game Stopped";

  const overlay = document.createElement("section");
  overlay.classList.add("overlay");

  const statistics = document.createElement("section");
  statistics.classList.add("statistics");
  statistics.innerHTML = `
    <h3>Game Statistics</h3>
    <p>Correct Answers: <span id="correctCount">${correctScore.textContent}</span></p>
    <p>Incorrect Answers: <span id="incorrectCount">${incorrectScore.textContent}</span></p>
  `;

  const message = document.createElement("h2");
  message.textContent = "Good job!";

  const selectPrompt = document.createElement("p");
  selectPrompt.classList.add("new-topic-selection");
  selectPrompt.textContent = "Select a new subject:";

  const selectDropdown = document.createElement("select");
  selectDropdown.setAttribute("id", "topicDropdown");
  selectDropdown.classList.add("new-topic-selection");
  const topics = [
    "JavaScript",
    "PHP",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Git",
    "C lang",
    "Go lang",
    "Various Web Dev",
  ];
  topics.forEach((topic, index) => {
    const option = document.createElement("option");
    option.textContent = topic;
    option.value = index;
    selectDropdown.appendChild(option);
  });

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.addEventListener("click", () => {
    const selectedIndex = selectDropdown.value;
    if (selectedIndex >= 0 && selectedIndex < topics.length) {
      currentTopic = selectedIndex;
      main(questions[currentTopic]); //eslint-disable-line
    }
    document.getElementById("container").removeChild(overlay);
  });

  const exitButton = document.createElement("button");
  exitButton.textContent = "Exit";
  exitButton.addEventListener("click", () => {
    main(questions[currentTopic]); //eslint-disable-line
    document.getElementById("container").removeChild(overlay);
  });

  overlay.appendChild(message);
  overlay.appendChild(statistics);
  overlay.appendChild(selectPrompt);
  overlay.appendChild(selectDropdown);
  overlay.appendChild(submitButton);
  overlay.appendChild(exitButton);

  document.getElementById("container").appendChild(overlay);
};

// This function is called when the game is paused,
// either due to a correct/incorrect answer or timeout.
// It updates the score, disables user input (if applicable),
// highlights correct/incorrect answers,
// and updates the submit button text accordingly.
const pauseGame = (correct, timeout, question) => {
  if (!gameStarted) {
    return;
  }

  clearTimeout(timeoutID);
  updateScore(correct);
  evaluated = true;
  const submit = document.querySelector("#submitButton");
  submit.classList.add("pause");

  if (
    question.type === "text-input" &&
    document.querySelector("#text-answer")
  ) {
    const input = document.querySelector("#text-answer");
    input.disabled = true;
    input.parentElement.setAttribute("disabled", "");
    const label = input.parentNode;
    label.textContent = `Correct answer: ${correctAnswer}`;
    if (!correct) {
      label.style.color = "#dc3545";
    } else {
      label.style.color = "#28a745";
    }
  } else if (question.type === "selection" || question.type === "checkbox") {
    const inputs = questionBody.querySelectorAll("input[name=answer]");
    inputs.forEach((input) => {
      input.disabled = true;
      input.parentElement.setAttribute("disabled", "");
      const label = input.parentNode;
      const isCorrect = question.correct.includes(input.value);
      if (isCorrect) {
        label.style.color = "#28a745";
      } else {
        label.style.color = "#dc3545";
      }
    });
  }

  if (correct) {
    submit.textContent = "Correct! Click to continue";
    submit.style.backgroundColor = "#28a745";
  } else if (timeout) {
    submit.textContent = "Time's up! Click to continue";
    submit.style.backgroundColor = "#ff8f00";
  } else {
    submit.textContent = "Incorrect! Click to continue";
    submit.style.backgroundColor = "#dc3545";
  }
  buttons[1].disabled = true;
  submit.addEventListener("click", nextQuestion);
};

// This function is called to move to the next question in the game.
// It increments the currentQuestion counter, resets the evaluated flag,
// and checks if the game has reached the end. If not, it sets the next question.
const nextQuestion = () => {
  currentQuestion++;
  evaluated = false;
  buttons[1].disabled = false;
  if (currentQuestion >= questionsToAsk.length) {
    gameStarted = false;
    stopGame();
  } else {
    setQuestion(questionsToAsk, currentQuestion);
  }
};

// This function updates the score based on whether the provided answer
// was correct or incorrect. It increments either the correct or incorrect score counter.
const updateScore = (correct) => {
  if (!gameStarted || evaluated) return;
  if (correct) {
    correctScore.textContent++;
  } else {
    incorrectScore.textContent++;
  }
};

// This function compares the provided answer with the correct answer and
// returns true if they match, false otherwise. It handles both text input
// and selection/checkbox type questions.
const evaluateAnswer = (answer, correct) => {
  if (answer === null || answer.length !== correct.length || timeout === true) {
    return false;
  }
  if (Array.isArray(answer)) {
    for (let i = 0; i < answer.length; i++) {
      if (!correct.includes(answer[i])) {
        return false;
      }
    }
  } else {
    if (answer.toLowerCase() !== correct.toLowerCase()) {
      return false;
    }
  }
  return true;
};

// This function sets up the question interface for the specified question index.
// It populates the question text, answer options, and submit button.
// It also sets event listeners for user interactions and handles timeouts.
const setQuestion = (questionSet, index) => {
  if (!gameStarted) {
    return;
  }

  const question = questionSet[index];
  correctAnswer = question.correct;
  currentAnswer = null;
  timeout = false;
  questionNum.textContent = `${index + 1}/${questionSet.length}`;
  questionText.textContent = question.title;
  questionBody.innerHTML = "";

  const submit = document.createElement("button");
  submit.setAttribute("type", "submit");
  submit.setAttribute("id", "submitButton");
  const text = document.createElement("span");
  text.textContent = "Submit";
  submit.appendChild(text);

  if (question.type === "text-input") {
    const input = document.createElement("input");
    const label = document.createElement("label");
    label.appendChild(input);
    label.classList.add("text-answer");
    input.setAttribute("id", "text-answer");
    questionBody.appendChild(label);
    submit.addEventListener("click", (e) => {
      e.preventDefault();
      currentAnswer = input.value;
      clearTimeout(timeoutID);
      pauseGame(
        evaluateAnswer(currentAnswer, correctAnswer),
        timeout,
        question,
      );
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
      const checkedRadioButton = questionBody.querySelector(
        "input[name=answer]:checked",
      );
      if (checkedRadioButton) {
        currentAnswer = checkedRadioButton.value;
      }
      pauseGame(
        evaluateAnswer(currentAnswer, correctAnswer),
        timeout,
        question,
      );
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
      currentAnswer = [];
      questionBody
        .querySelectorAll("input[name=answer]:checked")
        .forEach((input) => {
          currentAnswer.push(input.value);
        });
      pauseGame(
        evaluateAnswer(currentAnswer, correctAnswer),
        timeout,
        question,
      );
    });
  }

  timeoutID = setTimeout(() => {
    timeout = true;
    submit.classList.add("pause");
    questionBody.querySelectorAll("input").forEach((input) => {
      input.disabled = true;
      input.parentElement.setAttribute("disabled", "");
    });
    pauseGame(evaluateAnswer(currentAnswer, correctAnswer), timeout, question);
  }, 30000);

  questionBody.appendChild(submit);
};

// This function is triggered when a button (Start, Stop, Skip) is clicked.
// It performs different actions based on the button clicked, such as
// starting the game, stopping the game, or skipping to the next question.
const triggerClick = (button) => {
  switch (button) {
    case "Start":
      if (!gameStarted) {
        gameStarted = true;
        currentQuestion = 0;
        correctScore.textContent = 0;
        incorrectScore.textContent = 0;
        setQuestion(questionsToAsk, currentQuestion);
        buttons[0].disabled = true;
        buttons[1].disabled = false;
        buttons[2].disabled = false;
      }
      break;

    case "Stop":
      if (gameStarted) {
        gameStarted = false;
        currentQuestion = 0;
        stopGame();
        buttons[0].disabled = false;
      }
      break;

    case "Skip":
      if (gameStarted) {
        clearTimeout(timeoutID);
        updateScore(evaluateAnswer("a", "b"));
        nextQuestion();
      }
      break;
  }
};

// This function shuffles the elements of an array in place, using
// the Fisher-Yates algorithm. It's used to randomize the order of
// questions before starting the game.
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

// This function initializes the game interface when the page loads
// or when the game is restarted. It sets up the initial state of the game,
// including displaying the first question and enabling/disabling buttons accordingly.
const main = (questions) => {
  questionText.textContent = "Start the game to see the question";
  questionBody.innerHTML = "";
  questionNum.textContent = "0/10";

  dateField.textContent = `Today's date: ${date}`;
  subject.textContent = questions[0].topic;
  questionsToAsk = shuffleArray(questions);

  buttons[2].disabled = true;
  buttons[1].disabled = true;
  buttons[0].disabled = false;
};

// Initialization
// Placing this inside main has weird effect when new game starts
// (causing the buttons to be clicked n++ times for each new game)
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    triggerClick(button.textContent);
  });
});

main(questions[currentTopic]); //eslint-disable-line
