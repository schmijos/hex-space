class Field {
  constructor(factor, flag = null, strength = 0) {
    this.factor = factor;
    this.strength = strength;
    this.flag = flag;
  }
}

class Board {
  constructor(height, width, flags = ['Blue', 'Megabyte Mint']) {
    this.height = height;
    this.width = width;

    this.grid = [
      [
        new Field(1.0, flags[0], 10),
        new Field(1.0),
        new Field(1.0),
      ], [
        new Field(1.0),
        new Field(1.0),
        new Field(1.0),
      ], [
        new Field(1.0),
        new Field(1.0),
        new Field(1.0, flags[1], 10),
      ]
    ];
  }

  allAdjacentCoords(coords) {
    let offsets = [
      [-1, -1], [-0, -1], [+1, -1],
      [-1, -0], [+0, +1], [+1, +0]
    ];

    return offsets.map(function(offset) {
      return [coords[0] + offset[0], coords[1] + offset[1]];
    });
  }

  isAdjacent(coords, otherCoords) {
    return this.allAdjacentCoords(coords).find(function(coords) {
      return (coords[0] === otherCoords[0]) && (coords[1] === otherCoords[1]);
    });
  }

  field(coords) {
    return this.grid[coords[0]][coords[1]];
  }

  move(originField, targetField, menToMove) {
    originField.strength -= menToMove;
    targetField.strength += menToMove;
    targetField.flag = originField.flag; // We never leave our flag behind
  }

  occupy(originField, targetField) {
    let menToMove = Math.trunc(originField.strength / 2);
    this.move(originField, targetField, menToMove);
  }

  reinforce(originField, targetField) {
    let menToMove = Math.trunc(originField.strength / 2);
    this.move(originField, targetField, menToMove);
  }

  attack(originField, targetField) {
    let attackers = originField.strength - 1;
    let defenders = targetField.strength;
    let casualties = Math.min(attackers, defenders);

    originField.strength -= casualties;
    targetField.strength -= casualties;

    if(targetField.strength === 0) {
      this.move(originField, targetField, originField.strength - 1);
    }
  }

  play(myFlag, originCoords, targetCoords) {
    let originField = this.field(originCoords);
    let targetField = this.field(targetCoords);

    if(originField.flag !== myFlag) {
      return false;
    }

    if(!this.isAdjacent(originCoords, targetCoords)) {
      return false;
    }

    switch(targetField.flag) {
      case null:
        this.occupy(originField, targetField);
        break;
      case myFlag:
        this.reinforce(originField, targetField);
        break;
      default:
        this.attack(originField, targetField);
    }

    return true;
  }
}
