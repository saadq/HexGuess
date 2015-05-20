(function() {
  'use strict';

  // View used to manipulate game UI
  var view = {
    livesDisplay: document.querySelector('#lives'),
    levelDisplay: document.querySelector('#level'),
    hexColor: document.querySelector('#hexColor'),
    squares: document.querySelector('#coloredSquares'),
    result: document.querySelector('#result'),

    /**
     * Changes the display to the updated values for the current level,
     * the amount of lives left, and the current hex color
     */
    update: function() {
      view.livesDisplay.textContent = game.lives;
      view.levelDisplay.textContent = game.level;
      view.hexColor.textContent = game.currentColor;
    }
  };

  // Controller for main game logic
  var game = {};

  // The current level the player is on, starting at 1
  game.level = 1;

  // The amount of lives the player has left, starting at 5
  game.lives = 5;

  // The amount of guesses the player has tried for the current level
  game.tries = 0;

  // The current hex color being displayed
  game.currentColor = '';

  // This will hold a reference to the square that is the correct answer
  game.correctSquare = null;

  /**
   * Generates a bright and colorful hexadecimal value
   * Uses David Merfield's randomColor.js to avoid dark colors
   *
   * @returns {String}
   */
  game.randHexColor = function() {
    return randomColor({
      luminosity: 'bright',
    });
  };

  /**
   * Creates a colored square with a random color
   */
  game.createSquares = function() {
    var squareCount = this.level + 1;
    for (var i = 0; i < squareCount; i++) {
      var square = document.createElement('li');
      var color = game.randHexColor();
      square.style.backgroundColor = color;
      square.id = color;
      square.classList.add('square');
      view.squares.appendChild(square);
    }
    game.assignCorrectSquare();
  };

  /**
   * Choose a random square to be the correct answer
   */
  game.assignCorrectSquare = function() {
    var squares = document.getElementsByClassName('square');
    var randSquare = squares[Math.floor(Math.random() * 100 % squares.length)];
    var color = game.randHexColor();
    randSquare.id = color;
    randSquare.style.backgroundColor = color;
    game.correctSquare = randSquare;
    game.currentColor = color;
  };

  /**
   * The main click handlers for every square div
   */
  game.squareClickHandler = function(event) {
    game.tries++;

    var clickedSquare = event.target;
    if (clickedSquare === game.correctSquare) {
      game.levelUp();
      view.result.textContent = 'Correct!';
      if (game.tries === 1)  {
        game.addLife();
      }
      render(game);
    } else {
      game.loseLife(clickedSquare);
      clickedSquare.style.opacity = '0';
      view.update();
    }
  };

  /**
   * Goes through each updated square and adds the click handler
   */
  game.updateSquareClickHandlers = function() {
    var squares = document.getElementsByClassName('square');
    for (var i = 0; i < squares.length; i++) {
      squares[i].addEventListener('click', game.squareClickHandler);
    }
  };

  /**
   * Removes all squares from the game
   */
  game.clearSquares = function() {
    var squares = document.getElementsByClassName('square');
    while (squares.length) {
      squares[0].remove();
    }
  };

  /**
   * Checks to see if the clicked on square is the correct answer
   *
   * @param {DOMElement} square - A reference to a div with a class of 'square'
   * @returns {Boolean}
   */
  game.isCorrectSquare = function(square) {
    return square === game.correctSquare;
  };

  /**
   * Increases the current level
   */
  game.levelUp = function() {
    this.level++;
  };

  /**
   * Increases the current amount of lives
   */
  game.addLife = function() {
    this.lives++;
    view.result.textContent += ' You get an extra life for getting it on the first try!';
  };

  /**
   * Decreases the current amount of lives
   *
   * @param {DOMElement} clickedSquare - The incorrect square that was clicked on
   */
  game.loseLife = function(clickedSquare) {
    this.lives--;
    if (this.lives === 0) {
      view.result.id = 'gameOver';
      view.result.textContent = 'Game Over!';
      game.over();
    } else {
      view.result.textContent = 'Wrong choice! That color was ' + clickedSquare.id;
    }
  };


  game.updateView = function() {
    view.livesDisplay.textContent = game.lives;
    view.levelDisplay.textContent = game.level;
    view.hexColor.textContent = game.currentColor;
  };

  /**
   * Ends the game
   */
  game.over = function() {
    game.clearSquares();
    game.currentColor = '';
    view.update();

    var replayButton = document.createElement('button');
    replayButton.textContent = 'Play Again';
    replayButton.id = 'replayButton';
    replayButton.addEventListener('click', function() {
      window.location = 'index.html';
    });

    var wrapper = document.querySelector('.wrapper');
    wrapper.appendChild(replayButton);
  };

  /**
   * Renders the game by clearing the previous squares,
   * adding in the new squares, and updating the View
   */
  function render(game) {
    game.tries = 0;
    game.clearSquares();
    game.createSquares();
    game.updateSquareClickHandlers();
    view.update();
  }

  // Start the game
  render(game);

})();
