class TurnState {
  constructor(players) {
    this.queue = players.map(function(el) { return el; });
    this.from = null;
    this.to = null;
  }

  get player() {
    return this.queue[0];
  }

  nextPlayer() {
    this.queue.push(this.queue.shift());
    this.from = null;
    this.to = null;
    return this.player;
  }
}