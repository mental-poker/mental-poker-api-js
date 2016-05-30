import Deck from './deck';
import Game from './game';
import Player from './player';

export {
  Player,
};

export default async function () {
  const PLAYER_COUNT = 4;

  const players = Array.from({ length: PLAYER_COUNT }).map(() => new Player());
  const game = new Game(players);

  console.log('3.1.1 done');

  // 3.1.2 - Cascaded shuffling
  let deck = game.deckOriginal;
  for (const player of players) {
    // Improve the accessibility of secrets later by using the last one now
    const lastSecret = player.secrets[player.secrets.length - 1];
    deck = deck.shuffle(player.randomizer).encryptAll(lastSecret);
  }

  console.log('3.1.2 done');

  // 3.1.3 - Locking
  for (const player of players) {
    const lastSecret = player.secrets[player.secrets.length - 1];
    deck = deck.decryptAll(lastSecret).encryptAll(player.secrets);
  }

  game.deckEncrypted = deck;
  console.log('3.1.3 done');

  // 3.2 - Drawing
  const index = 42;
  const secrets = [];
  for (const player of players) {
    secrets.push(player.secrets[index]);
  }

  console.log(deck.decryptSingle(index, secrets));
  console.log(game.drawCard(index, secrets));
  console.log('3.2 done');
}
