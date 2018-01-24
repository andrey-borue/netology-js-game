'use strict';

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(vector) {
    if (!(vector instanceof Vector)) {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector');
    }

    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  times(factor) {
    return new Vector(this.x * factor, this.y * factor);
  }
}


class Actor {
  constructor(pos, size, speed) {
    if (pos === undefined) {
      pos = new Vector(0, 0);
    }

    if (size === undefined) {
      size = new Vector(1, 1);
    }

    if (speed === undefined) {
      speed = new Vector(0, 0);
    }

    if (!(pos instanceof Vector)) {
      throw new Error('pos должно быть типа Vector');
    }

    if (!(size instanceof Vector)) {
      throw new Error('size должно быть типа Vector');
    }

    if (!(speed instanceof Vector)) {
      throw new Error('speed должно быть типа Vector');
    }

    this.pos = pos;
    this.size = size;
    this.speed = speed;

  }
  act() {

  }
  get left() {
    return this.pos.x;
  }
  get right() {
    return this.pos.x + this.size.x;
  }
  get top() {
    return this.pos.y;
  }
  get bottom() {
    return this.pos.y + this.size.y;
  }
  get type() {
    return 'actor';
  }
  isIntersect(actor) {
    if (!(actor instanceof Actor)) {
      throw new Error('actor должно быть типа Actor');
    }
    if (actor === this) {
      return false;
    }

    const a = this;
    const b = actor;

    // return ( actor.top < this.bottom || actor.bottom > this.top || actor.right < this.left || actor.left > this.right );
    // return ( a.y < b.y1 || a.y1 > b.y || a.x1 < b.x || a.x > b.x1 );


    // actor.bottom = 55
    // actor.left = 30
    // actor.right = 35
    // actor.top = 50

    if (b.right >= a.right && b.left <= a.left) {
      return true;
    }

    if (b.right <= a.right && b.left >= a.left) {
      return true;
    }

    if (b.top <= a.top && b.bottom >= a.bottom) {
      return true;
    }

    if (b.top >= a.top && b.bottom <= a.bottom) {
      return true;
    }

    if (b.left >= a.right || b.right <= a.left || b.bottom <= a.top || b.top >= a.bottom) {
      return false;
    }

    return true;
  }
}

class Level {
  constructor(grid, actors) {
    this.grid = grid; // Двумерный массив строк grid[y][x] типа coin,wall,lava
    this.actors = []; // Список движущихся объектов

    this.player = null;

    if (actors !== undefined) {
      this.actors = actors;
      for (let a of actors) {
        if (a.type === 'player') {
          this.player = a;
          break;
        }
      }
    }

    this.height = 0;
    this.width = 0;
    if (grid) {
      grid.forEach(row => this.width = (row.length > this.width ? row.length : this.width));
      this.height = grid.length;
    }

    this.status = null;
    this.finishDelay = 1;
  }

  isFinished() {
    return this.status !== null && this.finishDelay < 0;
  }
  actorAt(actor) {
    if (!(actor instanceof Actor)) {
      throw new Error('actor должно быть типа Actor');
    }

    if (this.height === 0) {
      return undefined;
    }

    for (let a of this.actors) {
      if (a.isIntersect(actor)) {
        return a;
      }
    }
  }
  obstacleAt(position, size) {
    if (!(position instanceof Vector)) {
      throw new Error('position должно быть типа Vector');
    }

    if (!(size instanceof Vector)) {
      throw new Error('size должно быть типа Vector');
    }
  }
  removeActor(actor) {
    for (let i in this.actors) {
      if (actor === this.actors[i]) {
        this.actors.splice(i, 1);
        return;
      }
    }
  }
  noMoreActors(type) {
    if (this.actors.length === 0) {
      return true;
    }

    for (let actor of this.actors) {
      if (actor.type === type) {
        return false;
      }
    }

    return true;
  }
  playerTouched(type, actor) {
    if (this.status !== null) {
      return;
    }

    if (type === 'lava' || type === 'fireball') {
      this.status = 'lost';
      return;
    }

    if (type === 'coin' && actor instanceof Actor) {
      this.grid[actor.top][actor.left] = undefined;
    }
  }
}

class LevelParser {
  constructor(list) {
    this.list = list;
  }
  actorFromSymbol(symbol) {
    if (symbol === undefined) {
      return undefined;
    }

    if (symbol in this.list) {
      return this.list[symbol];
    }

    return undefined;
  }

  obstacleFromSymbol(symbol) {
    let result;
    switch (symbol) {
      case 'x':
        result = 'wall';
        break;
      case '!':
        result = 'lava';
        break;
    }

    return result;
  }

  createGrid(plan) {
    let result = [];

    for (let y in plan) {
      let row = [];
      for (let x in plan[y]) {
        row.push(this.obstacleFromSymbol(plan[y][x]));
      }
      result.push(row);
    }

    // plan.forEach(row => {
    //   let newrow = [];
    //   row.forEach(col => {
    //     newrow.push(this.obstacleFromSymbol(col));
    //   });
    //   result.push(newrow);
    // });
    return result;
  }
  createActors(plan) {
    let result = [];

  }
  parse() {

  }
}

class Fireball {


}