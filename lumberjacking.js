/*
Lumberjacking

Spiral wood harvest with ignore list and auto-drop

0 - 100 Minoc forest
*/

const axeGraphic = 0xF47; //(!) Check this by get in-game target info 


const woodGraphic = 0x1BDD

//Uncomment to ignore
const arrIgnoreWood = [
  // 0x0,   //Plain
  // 0x7DA, //Oak
  // 0x4A7, //Ash
  // 0x4A8, //Yew
  // 0x4AA, //Bloodwood
  // 0x4A9, //Heartwood
  // 0x47F, //Frostwood
]

const arrIgnoreRes = [
  // 0x2F5F, //Switch
  // 0x318F, //Bark Fragment
  // 0x3191, //Luminescent Fungi
  // 0x3190, //Parasitic Plant
  // 0x3199, //Brilliant Amber
]

const arrOffset = [[1, 1], [1, 0], [0, 1], [0, 0]]

const arrWood = [0xcd8, 0xcd3, 0xce6, 0xce3, 0xcd0, 0xccd, 0xcda, 0xcdd, 0xce0]

const arrDir = [Directions.Up, Directions.North, Directions.Right, Directions.East, Directions.Down, Directions.South, Directions.West, Directions.Left]

const getDirection = (angle) =>
  arrDir[Math.round(angle / 45) % 8]

const getDistance = (x1, y1, x2, y2) =>
  Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2))

const correct360 = n => 
  n < 0 ? correct360(n + 360) : n

const getAngle = (x1, y1, x2, y2) =>
  correct360(atan2(y2 - y1, x2 - x1) * (180 / PI))

const getAngleDrift = (d, a) =>
  correct360(Math.random() > 0.5 ? (a - d) : (a + d))
  
const movePlayerSteps = (n, angle) => {
  let d = getDirection(angle)

  for (let i = 0; i < n; i++) {
    player.walk(d)
    sleep(100)
  }
}

const movePlayerToItem = (x, y) => {
  let px, py
  let moveBugCount = 0
  let distance = getDistance(player.x, player.y, x, y)

  while (distance > 1) {
    movePlayerSteps(1, getAngle(x, y, player.x, player.y))
    chopItem
    if (px == player.x && py == player.y) {
      moveBugCount++

      if (moveBugCount > 5) {
        movePlayerSteps(5, getAngleDrift(90, getAngle(x, y, player.x, player.y)))
        moveBugCount = 0
      }
    }

    distance = getDistance(player.x, player.y, x, y)
    
    px = player.x
    py = player.y
  }
}

const dropItemGround = (serial) => 
  arrOffset.some(([x, y]) => {
    player.moveItemOnGroundOffset(serial, x, y, 0)
    sleep(500)

    return !player.backpack.contents.some(item => item.serial == serial)
  })

const chopItem = (serial) => {
  player.useType(axeGraphic);
  target.waitTargetEntity(serial, 3000)
  sleep(300)
}

const chopTree = (x, y, graphic) => {
  player.useType(axeGraphic);
  target.wait();
  target.terrainWithOffset(x, y, 0, graphic);
  sleep(1000)
}

const chopTreeFull = (x, y, graphic) => {
  let c = 10
  
  while c > 0 && !journal.containsText('There\'s not enough wood here') {
    chopTree(x, y, graphic)
    c--
  }
}

const release = () => {
  player.backpack.contents.map(item => item).forEach(item => {
    let f = item.graphic == woodGraphic

    if ((f && arrIgnoreWood.some(n => n == item.hue)) || arrIgnoreRes.some(n => n == item.graphic)) {
      dropItemGround(item.serial)
    } else if f {
      chopItem(item.serial)
    }
  })
}

const szudzikPair = (x, y) =>
  x >= y ? (x * x) + x + y : (y * y) + x

const spiral = (sx, sy, cb) => {
  let x = 0
  let y = 0
  let dx = 0
  let dy = -1
  let max = Math.pow(Math.max(sx, sy), 2)

  for (let i = 0; i < max; i++) {
    if ((-sx / 2 < x && x <= sx / 2) && (-sy / 2 < y && y <= sy / 2)) {
      if cb(x, y) == true {
        break
      }
    }

    if ((x == y) || (x < 0 && x == -y) || (x > 0 && x == 1 - y)) {
      [dx, dy] = [-dy, dx];
    }

    x = x + dx;
    y = y + dy;
  }
}


//
journal.clear()

while (true) {
  spiral(35, 35, (dx, dy) => {
    if player.weight >= player.weightMax {
      return true
    }

    let x = player.x + dx
    let y = player.y + dy
    let id = szudzikPair(x, y)

    if ignoreList.contains(id) {
      return false
    }

    let item = client.getTerrainList(x, y)

    if (item.length < 2 || !arrWood.some(i => i == item[1].graphic)) {
      ignoreList.add(id)
      return false
    }

    movePlayerToItem(x, y)
    chopTreeFull(item[1].x - player.x, item[1].y - player.y, item[1].graphic)
    release()

    ignoreList.add(id)
    journal.clear()

    return true
  })

  if player.weight >= player.weightMax {
    break
  }

  sleep(1000)
}































