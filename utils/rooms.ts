export const rooms: any = {};

export const createRoom = (roomId: number, playerId: string) => {
  rooms[roomId] = [playerId, ''];
};

export const joinRoom = (roomId: number, player2Id: string) => {
  rooms[roomId][1] = player2Id;
};

export const exitRoom = (roomId: number, player: number) => {
  if (player === 1) {
    delete rooms[roomId];
  } else {
    rooms[roomId][1] = '';
  }
};
