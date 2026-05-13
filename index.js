const mineflayer = require('mineflayer')

let bot = null

const randomMessages = [
    "bot afk",
    "bot đây",
    "hello",
    "chào cương",
    "đang online",
    "afk nha",
    "xin chào",
    "bot đang chạy"
]

function createBot(io) {

    if (bot) return bot

    bot = mineflayer.createBot({
        host: 'duccuong704.mcsh.io',
        port: 25565,
        username: 'CuongBot',
        version: false,
        auth: 'offline'
    })

    bot.on('login', () => {
        console.log('Bot đã vào server')
        io.emit('status', 'ONLINE')
    })

    bot.on('spawn', () => {
        console.log('Bot spawn')

        setInterval(() => {

            if (!bot) return

            // xoay đầu chống AFK
            bot.look(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                true
            )

            // nhảy
            bot.setControlState('jump', true)

            setTimeout(() => {
                bot.setControlState('jump', false)
            }, 500)

            // chat random
            const msg = randomMessages[
                Math.floor(Math.random() * randomMessages.length)
            ]

            bot.chat(msg)

        }, 15000)
    })

    bot.on('end', () => {
        console.log('Bot disconnected')
        io.emit('status', 'OFFLINE')
        bot = null
    })

    bot.on('error', (err) => {
        console.log(err)
    })

    return bot
}

function stopBot() {
    if (bot) {
        bot.quit()
        bot = null
    }
}

function reconnectBot(io) {
    stopBot()

    setTimeout(() => {
        createBot(io)
    }, 3000)
}

function respawnBot() {
    if (bot) {
        bot.chat('/respawn')
    }
}

module.exports = {
    createBot,
    stopBot,
    reconnectBot,
    respawnBot
          }
