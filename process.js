const os = require('os')
const cluster = require('cluster')

if (cluster.isMaster) {

	// Ветка мастера. Запускаю процессы, раздаю сообщения, завершаю

	for (let i = 0; i < os.cpus().length - 2; i++) {
		const worker = cluster.fork()
		setTimeout(() => {
			worker.send("Здарова из мастера")
		}, 3000)
		setTimeout(() => {
			worker.disconnect()
		}, 4000)
	}

	// Пинг мастера
	setInterval(() => {
		console.log(`[${process.pid}] Мастер все еще живет, ${Math.floor(process.uptime())} sec`)
	}, 2000)

} else {
	// Ветка воркера

	// Пинг
	const id = setInterval(() => {
		console.log(`[${process.pid}] Все еще живет, ${Math.floor(process.uptime())} sec`)
	}, 2000)

	process.on('message', (msg) => {
		console.log(`[${process.pid}] поймал сообщение: "${msg}"`)
	})
	process.on('disconnect', () => {
		console.log(`[${process.pid}] Завершается`)
		clearInterval(id)
	})
	process.on('exit', () => {
		console.log(`[${process.pid}] Завершился`)
	})
}
