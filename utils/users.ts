/* eslint-disable quote-props */
export const connectedUsers: any = {};
export const choices: any = {};
export const winCombinations: any = {
  'rock': 'scissors',
  'paper': 'rock',
  'scissors': 'paper',
};

export const initializeChoices = (roomId: string) => {
  choices[roomId] = ['', ''];
};

export const userConnected = (userId: string) => {
  connectedUsers[userId] = true;
};

export const makeMove = (roomId: string, player: number, choice: string) => {
  if (choices[roomId]) {
    choices[roomId][player - 1] = choice;
  }
};
