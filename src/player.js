import seedrandom from 'seedrandom';
import * as Config from './config';
import Randomizer from './randomizer';

export default class Player {
  seed;
  randomizer;
  points;
  secrets;

  constructor({ seed = null, points = null } = {}) {
    if (points) {
      // The player's seed is unknown
      this.points = points;
    } else {
      // The player is self
      this.seed = seed || Randomizer.getSeed();

      this.randomizer = new Randomizer(
        seedrandom.xor4096(this.seed.value)
      );

      this.points = Array.from(new Array(Config.CARDS_IN_DECK), () =>
        Config.EC.g.mul(
          this.randomizer.getBigInt(Config.BI_RED_ONE, Config.BI_RED_EC_N)
            .fromRed()
        )
      );

      this.secrets = Array.from(new Array(Config.CARDS_IN_DECK + 1), () =>
        this.randomizer.getBigInt(Config.BI_RED_ONE, Config.BI_RED_EC_N)
      );
    }
  }

  shuffleDeck(deck) {
    // Improve the accessibility of secrets later by using the last one now
    const lastSecret = this.secrets[this.secrets.length - 1];

    // Shuffle the deck and then encrypt it to avoid data leaks
    return deck.shuffle(this.randomizer).encrypt(lastSecret);
  }

  lockDeck(deck) {
    const lastSecret = this.secrets[this.secrets.length - 1];

    // Remove the shuffle encryption and then lock each card one by one
    return deck.decrypt(lastSecret).lock(this.secrets);
  }
}
