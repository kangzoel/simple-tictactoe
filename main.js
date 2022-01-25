import './style.css'

const $canvas = document.querySelector('canvas')
const ctx = $canvas.getContext('2d')

const $startButton = document.getElementById('startButton')
const $lose = document.getElementById('lose')
const $tie = document.getElementById('tie')

const cs = $canvas.width
const gs = $canvas.width / 3

const h = 'x'
const c = 'o'

let board = [
    ['', '', ''],
    ['', c, ''],
    ['', '', ''],
]

function setup() {
    ctx.lineCap = 'round'
    ctx.font = '64px Segoe UI, Arial, sans-serif'

    draw()
}

function coordToSpot(x, y) {
    switch (true) {
        case x == 0 && y == 0:
            return 1
        case x == 0 && y == 1:
            return 2
        case x == 0 && y == 2:
            return 3
        case x == 1 && y == 2:
            return 4
        case x == 2 && y == 2:
            return 5
        case x == 2 && y == 1:
            return 6
        case x == 2 && y == 0:
            return 7
        case x == 1 && y == 0:
            return 8
        case x == 1 && y == 1:
            return 9
    }
}

function spotToCoord(spot) {
    switch (spot) {
        case 1:
            return [0, 0]
        case 2:
            return [0, 1]
        case 3:
            return [0, 2]
        case 4:
            return [1, 2]
        case 5:
            return [2, 2]
        case 6:
            return [2, 1]
        case 7:
            return [2, 0]
        case 8:
            return [1, 0]
        case 9:
            return [1, 1]
    }
}

function fillSpot(spot, who) {
    const [x, y] = spotToCoord(spot)

    board[x][y] = who

    draw()
}

function computerMove(spot) {
    return spot - 8 * Math.floor((spot - 1) / 8)
}

function draw() {
    ctx.clearRect(0, 0, cs, cs)

    ctx.beginPath()
    ctx.rect(1, 1, cs - 2, cs - 2)
    ctx.stroke()

    let pos = 0

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const x = i * gs
            const y = j * gs
            ctx.beginPath()
            ctx.rect(x, y, gs, gs)
            ctx.stroke()

            ctx.lineWidth = 10
            switch (board[j][i]) {
                case h:
                    ctx.strokeStyle = 'green'
                    ctx.beginPath()
                    ctx.moveTo(x + gs * .2, y + gs * .2)
                    ctx.lineTo(x + gs * .8, y + gs * .8)
                    ctx.moveTo(x + gs * .8, y + gs * .2)
                    ctx.lineTo(x + gs * .2, y + gs * .8)
                    ctx.stroke()
                    break;
                case c:
                    ctx.strokeStyle = 'red'
                    ctx.beginPath()
                    ctx.arc(x + gs / 2, y + gs / 2, 34, 0, Math.PI * 2)
                    ctx.stroke()
                    break;
                default:
                    ctx.fillText(coordToSpot(j, i), x + 33, y + 74);
            }
            ctx.lineWidth = 1
            ctx.strokeStyle = 'black'
            pos++
        }
    }
}

async function lose(isTrue = true) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (isTrue) {
                $lose.style.display = 'block'
                $tie.style.display = 'none'
            } else {
                $lose.style.display = 'none'
                $tie.style.display = 'block'
            }
            resolve(true)
        }, 500);
    })
}

async function userInput() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(parseInt(prompt('Masukkan spot yang kosong')))
        }, 500);
    })
}

$startButton.onclick = async _ => {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]

    $lose.style.display = 'none'
    $tie.style.display = 'none'

    let e, p, s, o, n
    let w, x, y, z

    e = 9
    fillSpot(e, c)

    w = await userInput()
    fillSpot(w, h)

    $startButton.textContent = 'Mulai Ulang'

    p = computerMove(w + 1)
    fillSpot(p, c)

    x = await userInput()
    fillSpot(x, h)

    if (x == computerMove(p + 4)) {

        s = computerMove(p + 2)
        fillSpot(s, c)

        y = await userInput()
        fillSpot(y, h)

        if (y == computerMove(s + 4)) {

            if (w % 2 != 0) {

                o = computerMove(s + 3)
                fillSpot(o, c)

                z = await userInput()
                fillSpot(z, h)

                if (z == computerMove(o + 4)) {
                    n = computerMove(o + 6)
                    fillSpot(n, c)
                    await lose(false)
                } else {
                    n = computerMove(o + 4)
                    fillSpot(n, c)
                    await lose()
                }
            } else {
                o = computerMove(s + 7)
                fillSpot(o, c)
                await lose()
            }
        } else {
            o = computerMove(s + 4)
            fillSpot(o, c)
            await lose()
        }
    } else {
        s = computerMove(p + 4)
        fillSpot(s, c)
        await lose()
    }
}

setup()