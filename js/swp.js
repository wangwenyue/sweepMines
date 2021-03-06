var log = console.log.bind(console)

var e = (selector) => {
    let ele = document.querySelector(selector)
    if (!ele) {
        alert(`${selector} not found`)
    } else {
        return ele
    }
}

var checkEdge = (x, y, row, col) => {
    return x >= 0 && x < col && y >= 0 && y < row
}

var initMap = (row, col, mineNum) => {
    let map = []

    var initRow = () => {
        for (let i = 0; i < row; i++) {
            map[i] = []
        }
    }

    var initCol = () => {
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                map[i][j] = 0
            }
        }
    }

    var initBlankMap = () => {
        initRow(row)
        initCol(row, col)
    }

    var randomMine = () => {
        var randomSpot = () => {
            let x = Math.floor(Math.random() * row)
            let y = Math.floor(Math.random() * col)
            if (map[x][y] != 9) {
                map[x][y] = 9
            } else {
                randomSpot()
            }
        }
        for (let i = 0; i < mineNum; i++) {
            randomSpot()
        }
    }

    var initFinalMap = () => {
        let dx = [0, 1, -1, 0, 1, -1, -1, 1]
        let dy = [1, 0, 0, -1, 1, -1, 1, -1]
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (map[i][j] != 9) {
                    for (let t = 0; t <= 8; t++) {
                        let x = i + dx[t]
                        let y = j + dy[t]
                        if (checkEdge(x, y, row, col) && map[x][y] == 9) {
                            map[i][j] += 1
                        }
                    }
                }
            }
        }
    }

    var makeMap = () => {
        initBlankMap(row, col)
        //log('initBlankMap successed')
        randomMine(row, col, mineNum)
        //log('randomMine successed')
        initFinalMap(row, col, map)
        //log('initFinalMap successed')
    }
    makeMap()
    log(map)
    return map
}

var renderHtml = (map) => {

    var renderRow = () => {
        let x = e('.gameBox')
        for (let i = 0; i < map.length; i++) {
            x.innerHTML +=
                `<ul class="row x-${i}" data-x="${i}"></ul>`
        }
    }

    var renderCol = () => {
        let y = document.querySelectorAll('.row')
        for (let i = 0; i < y.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                let p = map[i][j]
                if (p == 0) {
                    p = ''
                }
                y[i].innerHTML +=
                    `<li class="col y-${j} num-${p}" data-y="${j}">
                    <span>${p}</span>
                    <img src="pic/flag.svg" class="img-flag hide">
                </li>`
            }
        }
    }

    var renderMap = () => {
        renderRow()
        renderCol()
    }
    renderMap()
}

var sweepMine = (row, col, mineNum, isBoom) => {
    let safeCell = 0

    var checkWin = (safeCell) => {
        if (safeCell === (row * col - mineNum) && isBoom === 0) {
            alert('You win')
        }
    }

    var clearCell = (x, y) => {
        if (checkEdge(x, y, row, col)) {
            let cell = e(`.x-${x}`).children[y]
            if (cell.style.background !== 'white') {
                cell.style.background = 'white'
                cell.children[0].style.opacity = '1'
                cell.children[1].classList.add('hide')
                safeCell++
                checkWin(safeCell)
                if (cell.innerText === '') {
                    checkAroundMine(x, y)
                }
            }
        }
    }

    var checkAroundMine = (x, y) => {
        let dx = [0, 1, -1, 0, 1, -1, -1, 1]
        let dy = [1, 0, 0, -1, 1, -1, 1, -1]
        for (let i = 0; i < 8; i++) {
            let newX = x + dx[i]
            let newY = y + dy[i]
            clearCell(newX, newY)
        }
    }

    var bindCells = () => {
        let row = document.querySelectorAll('.row')
        var bindCell = (row) => {
            for (let i = 0; i < row.length; i++) {
                row[i].addEventListener('click', (event) => {
                    let self = event.target
                    if (self.tagName != 'LI') {
                        self = self.parentElement
                    }
                    let spanTag = self.children[0]
                    let imgTag = self.children[1]
                    let flag = imgTag.classList.contains('hide')
                    if (self.tagName === 'LI' && flag) {
                        if (spanTag.innerText === '9') {
                            isBoom = 1
                            let boomCells = document.querySelectorAll('.num-9')
                            for (let i = 0; i < boomCells.length; i++) {
                                boomCells[i].classList.add('boom')
                            }
                            alert('Game Over, you lose.')
                        } else if (spanTag.innerText !== 9 && self.style.background !== 'white') {
                            spanTag.style.opacity = '1'
                            self.style.background = 'white'
                            safeCell++
                            checkWin(safeCell)
                        }

                        if (self.children[0].innerText === '') {
                            let x = parseInt(self.parentElement.dataset.x)
                            let y = parseInt(self.dataset.y)
                            checkAroundMine(x, y)
                        }
                    }
                })
            }
        }

        var bindFlag = (row) => {
            for (let i = 0; i < row.length; i++) {
                var mineNumNow = mineNum
                row[i].addEventListener('contextmenu', (event) => {
                    event.preventDefault();
                    var self = event.target
                    if (self.tagName != 'LI') {
                        self = event.target.parentElement
                    }
                    if (self.tagName === 'LI') {
                        let imgTagClasslist = self.children[1].classList
                        let mineLeft = e('.mineLeft')
                        //stick flag
                        if (imgTagClasslist.contains('hide') && self.style.background !== 'white') {
                            if (mineNumNow !== 0) {
                                mineNumNow--
                            }
                            imgTagClasslist.remove('hide')
                        } else if (self.style.background !== 'white') {
                            //cancel flag
                            imgTagClasslist.add('hide')
                            mineNumNow++
                        }
                        mineLeft.innerText = `${mineNumNow}`
                    }
                })
            }
        }
        bindCell(row)
        bindFlag(row)
    }
    bindCells()
}

var gameStart = (row, col, mineNum, isBoom) => {
    var mineLeft = e('.mineLeft')
    mineLeft.innerText = `${mineNum}`
    var time = e('.tick')
    time.innerText = `0`
    var i = 1
    clearInterval(stopTime)
    stopTime = setInterval(() => {
        time.innerText = `${i++}`
    }, 1000)
    // isBoom = 0
    var box = e('.gameBox')
    box.innerHTML = ''
    var map = initMap(row, col, mineNum)
    renderHtml(map)
    sweepMine(row, col, mineNum, isBoom)
}

var setInitPara = (row, col, mineNum) => {

    let row_now = e('#row-now')
    let col_now = e('#row-now')
    let mine_now = e('#mine-now')

    row_now.innerHTML = row
    col_now.innerHTML = col
    mine_now.innerHTML = mineNum
    // log(row_now.innerHTML, col_now.innerHTML, mine_now.innerHTML)

}

var levelSelector = () => {
    var level = document.querySelectorAll('.choice-level')
    for (let i = 0; i < level.length; i++) {
        level[i].addEventListener('click', (event) => {
            var self = event.target
            if (self.innerHTML === 'Fresh') {

                let para = new Para()
                para.row = 9
                para.col = 9
                para.mineNum = 10
                setInitPara(para.row, para.col, para.mineNum)
                gameStart(para.row, para.col, para.mineNum, para.isBoom)

            } else if (self.innerHTML === 'Normal') {

                let para = new Para()
                setInitPara(para.row, para.col, para.mineNum)
                gameStart(para.row, para.col, para.mineNum, para.isBoom)

            } else if (self.innerHTML === 'Hell') {

                let para = new Para()
                para.row = 30
                para.col = 30
                para.mineNum = 99
                setInitPara(para.row, para.col, para.mineNum)
                gameStart(para.row, para.col, para.mineNum, para.isBoom)
            }
        })
    }
    let restart = e('.restart')
    restart.addEventListener('click', (event) => {
        //log('restart clicked', mineNum)
        let row_now = e('#row-now').innerHTML
        let col_now = e('#row-now').innerHTML
        let mine_now = e('#mine-now').innerHTML
        gameStart(row_now, col_now, mine_now, 0)
    })
}


var stopTime


class Para {
    constructor(isBoom, row, col, mineNum) {
        this.isBoom = 0
        this.row = 16
        this.col = 16
        this.mineNum = 40
    }
}


var __main = () => {
    levelSelector()
    let para = new Para()
    gameStart(para.row, para.col, para.mineNum, para.isBoom)
}

__main()
