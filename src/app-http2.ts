import fs from 'node:fs'
import http2 from 'http2'

const server = http2.createSecureServer({
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt'),
}, (req, res) => {

  console.log(req.url)

  // res.writeHead(200, { 'Content-Ttype': 'text/html' })
  // res.write('<h3>Hola Luisinho</h3>')
  // res.end()

  // const data = { name: 'Luisinho', ege: 30, city: 'new york' }
  // res.writeHead(200, { 'Content-Type': 'application/json' })
  // res.end( JSON.stringify(data) )

  if(req.url === '/') {
    const htmlFile = fs.readFileSync('./public/index.html', 'utf-8')
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end( htmlFile )
    return;
  }

  if(req.url?.endsWith('.js')) {
    res.writeHead(200, { 'Content-Type': 'application/javascript' })
  } else if(req.url?.endsWith('.css')) {
    res.writeHead(200, { 'Content-Type': 'text/css' })
  }

  try {
    const responseContent = fs.readFileSync(`./public${ req.url }`, 'utf-8')
    res.end(responseContent)
  } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end()
  }

})

server.listen(8080, () => {
  console.log('server running on port 8080')
})

