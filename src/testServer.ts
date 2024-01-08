import http from 'http'

const SERVER_PORT = 8080

const server = http.createServer((req, res) => {
  // Generate a random delay between 500ms and 2000ms
  const delay = Math.random() * (2000 - 500) + 500

  setTimeout(() => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Response from Server 1\n')
  }, delay)
})

server.listen(SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${SERVER_PORT}/`)
})
