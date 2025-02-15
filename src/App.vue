<script setup lang="ts">
import { computed, ref } from "vue";
import BoardSquare from "./components/BoardSquare.vue";
import type { Player, Square, Board } from "../types/type";

let moveCount = 0;

const board = ref<Board>([
  { row: 0, col: 0, symbol: "" },
  { row: 0, col: 1, symbol: "" },
  { row: 0, col: 2, symbol: "" },
  { row: 1, col: 0, symbol: "" },
  { row: 1, col: 1, symbol: "" },
  { row: 1, col: 2, symbol: "" },
  { row: 2, col: 0, symbol: "" },
  { row: 2, col: 1, symbol: "" },
  { row: 2, col: 2, symbol: "" },
]);

const winSquares = ref<Square[]>([]);

const playerOne: Player = {
  name: "Player One",
  symbol: "X",
  isBot: false,
};

const playerTwo: Player = {
  name: "Player Two",
  symbol: "O",
  isBot: false,
};

const currentPlayer = ref(playerOne);
const winner = ref<Player | null>(null);
const endGame = ref(true);

const displayStatus = computed(() => {
  //1 Winner
  if (winner.value) {
    return `Winner: ${winner.value?.name} (${winner.value?.symbol})!!!`;
  }

  //tie game
  let filledSquare = board.value.filter(
    (square) => square.symbol !== ""
  ).length;
  if (endGame.value && filledSquare === 9) {
    return `It's a tie!`;
  }

  //bot move
  if (currentPlayer.value.isBot) {
    return `${currentPlayer.value.name} (${currentPlayer.value.symbol}) is thinking...`;
  }

  //2 players game
  return `Turn: ${currentPlayer.value.name} (${currentPlayer.value.symbol})`;
});

const reset = () => {
  board.value.forEach((square) => {
    square.symbol = "";
    square.highlight = false;
  });
  winner.value = null;
  endGame.value = false;
  playerTwo.isBot = false;
  currentPlayer.value = playerOne;

  openDialog();
};

const botTurn = () => {
  if (winner.value) return;

  const emptySquares = board.value.filter((square) => square.symbol === "");
  if (emptySquares.length === 0) return;
  const randomSquare =
    emptySquares[Math.floor(Math.random() * emptySquares.length)];

  // wait 2 seconds before bot turn
  setTimeout(() => {
    turn(randomSquare, currentPlayer.value);
  }, 500);
};

const nextPlayer = () => {
  currentPlayer.value =
    currentPlayer.value.symbol === playerOne.symbol ? playerTwo : playerOne;
};

const turn = (square: Square, player: Player) => {
  if (winner.value) return;
  if (square.symbol !== "") return;
  if (currentPlayer.value !== player) return;

  moveCount++;
  square.symbol = player.symbol;
  console.table(board.value);
  console.log(currentPlayer.value);

  winSquares.value = getWinSquares();
  if (winSquares.value.length > 0) {
    // Highlight winning squares
    winSquares.value.forEach((square) => {
      square.highlight = true;
    });

    winner.value = currentPlayer.value;
    console.log(`Winner! ${currentPlayer.value.name}`);
    console.table(winSquares.value);
    return;
  }

  if (board.value.every((square) => square.symbol !== "")) {
    endGame.value = true;
    return;
  }

  if (singlePlayer && !currentPlayer.value.isBot) {
    nextPlayer();
    botTurn();
  } else {
    nextPlayer();
  }
};

const getWinSquares = () => {
  const winningSquares: Square[] = [];

  // Check rows
  for (let row = 0; row < 3; row++) {
    const currentSymbol = board.value[row * 3].symbol;
    const rowSquares = board.value.slice(row * 3, row * 3 + 3);
    if (
      rowSquares.every(
        (square) => square.symbol === currentSymbol && currentSymbol !== ""
      )
    ) {
      winningSquares.push(...rowSquares);
    }
  }

  // Check columns
  for (let col = 0; col < 3; col++) {
    const currentSymbol = board.value[col].symbol;
    const colSquares = [0, 1, 2].map((row) => board.value[row * 3 + col]);
    if (
      colSquares.every(
        (square) => square.symbol === currentSymbol && currentSymbol !== ""
      )
    ) {
      winningSquares.push(...colSquares);
    }
  }

  // Check diagonals
  const diagonalSquares = [0, 4, 8].map((index) => board.value[index]);
  const diagSymbol = diagonalSquares[0].symbol;
  if (
    diagonalSquares.every(
      (square) => square.symbol === diagSymbol && diagSymbol !== ""
    )
  ) {
    winningSquares.push(...diagonalSquares);
  }

  const antiDiagSymbol = board.value[2].symbol;
  const antiDiagonalSquares = [2, 4, 6].map((index) => board.value[index]);
  if (
    antiDiagonalSquares.every(
      (square) => square.symbol === antiDiagSymbol && antiDiagSymbol !== ""
    )
  ) {
    winningSquares.push(...antiDiagonalSquares);
  }

  return winningSquares;
};

const dialog = ref<HTMLDialogElement>();
const openDialog = () => {
  dialog.value?.showModal();
};
const closeDialog = () => {
  dialog.value?.close();
};

let singlePlayer = false;

const startSinglePlayerGame = () => {
  reset();
  closeDialog();
  singlePlayer = true;
  playerTwo.isBot = true;
};

const startTwoPlayerGame = () => {
  reset();
  closeDialog();
  singlePlayer = false;
};
</script>

<template>
  <main class="flex items-center justify-center m-12">
    <div class="mx-auto">
      <h1 class="text-4xl">Tic-Tac-Toe</h1>
      <hr class="my-4" />
      <div class="mx-auto">
        <button
          class="p-2 text-gray-900 rounded-lg bg-slate-300 hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500"
          @click="reset"
        >
          New Game
        </button>
        <h2 class="mt-8 mb-2 text-sm whitespace-wrap">
          {{ displayStatus }}
        </h2>
        <dialog
          ref="dialog"
          class="p-6 mt-8 bg-gray-500 rounded-xl shadow-3xl backdrop:bg-black/15 backdrop:backdrop-blur-md"
        >
          <p class="mt-3 mb-3 text-slate-300">Choose game type:</p>
          <button
            class="p-2 mr-5 text-gray-900 rounded-lg bg-slate-300"
            @click="startSinglePlayerGame"
          >
            Single Player
          </button>
          <button
            class="p-2 text-gray-900 rounded-lg bg-slate-300"
            @click="startTwoPlayerGame"
          >
            Two Players
          </button>
        </dialog>
        <div class="grid w-48 grid-cols-3 gap-1">
          <BoardSquare
            v-for="square in board"
            @click="turn(square, currentPlayer)"
            :value="square.symbol"
            :highlight="square.highlight"
          />
        </div>
      </div>
    </div>
  </main>
</template>
