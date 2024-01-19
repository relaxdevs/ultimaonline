### ClassicUO-web

##### I love this game and functional programming

```js
const arrDir = [Directions.Up, Directions.North, Directions.Right, Directions.East, Directions.Down, Directions.South, Directions.West, Directions.Left]

const getDirection = angle =>
  arrDir[round(angle / 45) % 8]

const correct360 = n => 
  n < 0 ? correct360(n + 360) : n

const getAngle = (x1, y1, x2, y2) =>
  correct360(atan2(y2 - y1, x2 - x1) * (180 / PI))

const moveTo = (x1, y1, x2, y2) =>
  getDirection(getAngle(x1, y1, x2, y2))
```

##### vs 

```dart
function MoveTo(destX, destY) {
  let locationX = destX;
  let locationY = destY;
  
  let myX = player.x;
  let myY = player.y;
  let distanceEW = player.x - locationX;
  let distanceNS = player.y - locationY;

  let d;

  if ((myX > locationX && myY > locationY) && (distanceEW > 1 && distanceNS > 1)) {
    d = Directions.Up;
  }
  else if ((myX < locationX && myY < locationY) && (distanceEW < -1 && distanceNS < -1)) {
    d = Directions.Down;
  }
  else if ((myX > locationX && myY < locationY) && (distanceEW > 1 && distanceNS < -1)) {
    d = Directions.Left;
  }
  else if ((myX < locationX && myY > locationY) && (distanceEW < -1 && distanceNS > 1)) {
    d = Directions.Right;
  }
  else if ((myX > locationX) && (distanceEW > 1)) {
    d = Directions.West;
  }
  else if ((myX < locationX) && (distanceEW < -1)) {
    d = Directions.East;
  }
  else if ((myY < locationY) && (distanceNS < -1)) {
    d = Directions.South;
  }
  else if ((myY > locationY) && (distanceNS > 1)) {
    d = Directions.North;
  }
  
  return d;
}
```




