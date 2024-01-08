import http from 'http'

const SERVER_PORT = 8080

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Response from Server 1\n')
})

server.listen(SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${SERVER_PORT}/`)
})
