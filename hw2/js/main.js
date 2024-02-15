// Constants
const buttons = document.querySelectorAll("button");
const correctScore = document.querySelector("#correct");
const incorrectScore = document.querySelector("#incorrect");
const points = document.querySelector("#points");

// Questions
const questions = {
  JavaScript: [
    {
      id: 1,
      type: "text-input",
      title: "What is the syntax for declaring a variable in JavaScript?",
      body: "",
      correct: "var",
    },
    {
      id: 2,
      type: "selection",
      title: "Which of the following is NOT a JavaScript data type?",
      body: ["a) String", "b) Boolean", "c) Float", "d) Number"],
      correct: "c) Float",
    },
    {
      id: 3,
      type: "checkbox",
      title: "Which of the following are JavaScript frameworks?",
      body: ["a) Angular", "b) React", "c) Vue", "d) jQuery"],
      correct: ["a) Angular", "b) React", "c) Vue"],
    },
    {
      id: 4,
      type: "text-input",
      title: "What is the output of the following code: console.log(2 + '2')?",
      body: "",
      correct: "22",
    },
    {
      id: 5,
      type: "selection",
      title: "Which keyword is used to exit a loop in JavaScript?",
      body: ["a) break", "b) continue", "c) return", "d) exit"],
      correct: "a) break",
    },
    {
      id: 6,
      type: "checkbox",
      title: "Which of the following are JavaScript array methods?",
      body: ["a) push()", "b) pop()", "c) slice()", "d) splice()"],
      correct: ["a) push()", "b) pop()", "c) slice()", "d) splice()"],
    },
    {
      id: 7,
      type: "text-input",
      title: "What is the result of the expression '5' == 5?",
      body: "",
      correct: "true",
    },
    {
      id: 8,
      type: "selection",
      title: "Which of the following is used to add a comment in JavaScript?",
      body: ["a) //", "b) /* */", "c) <!-- -->", "d) ##"],
      correct: "a) //",
    },
    {
      id: 9,
      type: "checkbox",
      title: "Which of the following are JavaScript string methods?",
      body: ["a) length()", "b) toUpperCase()", "c) trim()", "d) concat()"],
      correct: ["b) toUpperCase()", "c) trim()", "d) concat()"],
    },
    {
      id: 10,
      type: "text-input",
      title: "What is the result of the expression NaN === NaN?",
      body: "",
      correct: "false",
    },
  ],
  PHP: [
    {
      id: 1,
      type: "text-input",
      title: "What does PHP stand for?",
      body: "",
      correct: "Hypertext Preprocessor",
    },
    {
      id: 2,
      type: "selection",
      title: "Which of the following is NOT a PHP data type?",
      body: ["a) String", "b) Boolean", "c) Float", "d) Integer"],
      correct: "c) Float",
    },
    {
      id: 3,
      type: "checkbox",
      title: "Which of the following are PHP frameworks?",
      body: ["a) Laravel", "b) Symfony", "c) CodeIgniter", "d) Django"],
      correct: ["a) Laravel", "b) Symfony", "c) CodeIgniter"],
    },
    {
      id: 4,
      type: "text-input",
      title: "What is the output of the following code: echo 'Hello, World!';?",
      body: "",
      correct: "Hello, World!",
    },
    {
      id: 5,
      type: "selection",
      title: "Which keyword is used to exit a loop in PHP?",
      body: ["a) break", "b) continue", "c) return", "d) exit"],
      correct: "a) break",
    },
    {
      id: 6,
      type: "checkbox",
      title: "Which of the following are PHP array functions?",
      body: [
        "a) array_push()",
        "b) array_pop()",
        "c) array_slice()",
        "d) array_splice()",
      ],
      correct: [
        "a) array_push()",
        "b) array_pop()",
        "c) array_slice()",
        "d) array_splice()",
      ],
    },
    {
      id: 7,
      type: "text-input",
      title: "What is the result of the expression '5' == 5 in PHP?",
      body: "",
      correct: "true",
    },
    {
      id: 8,
      type: "selection",
      title: "Which of the following is used to add a comment in PHP?",
      body: ["a) //", "b) /* */", "c) <!-- -->", "d) ##"],
      correct: "b) /* */",
    },
    {
      id: 9,
      type: "checkbox",
      title: "Which of the following are PHP string functions?",
      body: ["a) strlen()", "b) strtoupper()", "c) trim()", "d) concat()"],
      correct: ["a) strlen()", "b) strtoupper()", "c) trim()"],
    },
    {
      id: 10,
      type: "text-input",
      title: "What is the result of the expression 10 % 3 in PHP?",
      body: "",
      correct: "1",
    },
  ],
};

// Variables
let gameStarted = false;

// Functions
const triggerClick = (button) => {
  switch (button) {
    case "Start":
      if (!gameStarted) {
        gameStarted = true;
        console.log(gameStarted);
      }
      break;
    case "Stop":
      if (gameStarted) {
        gameStarted = false;
        console.log(gameStarted);
      }
      break;
    case "Skip":
      if (gameStarted) {
        points.innerHTML--;
      }
      break;
  }
};

// Initialization
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    triggerClick(button.innerHTML);
  });
});
