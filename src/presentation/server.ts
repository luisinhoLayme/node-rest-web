import express, { Router } from 'express'
import path from 'node:path'

interface Options {
  port: number
  routes: Router
  public_path?: string
}

export class Server {

  private app = express()
  private readonly port: number
  private readonly publicPath: string
  private readonly routes: Router

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options
    this.port = port
    this.publicPath = public_path
    this.routes = routes
  }

  //video 8

  async start() {

    //NOTE: Middlewares
    this.app.use( express.json() ); // row
    this.app.use( express.urlencoded({ extended: true }) ) // x-ww-form-urlencoded


    //NOTE: Public Folder
    this.app.use( express.static( this.publicPath ) );

    //NOTE: Routes
    this.app.use(this.routes)



    //NOTE: SPA
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${ this.publicPath }/index.html`)
      res.sendFile(indexPath)
    })


    this.app.listen(this.port, () => {
      console.log(`Server runing on port ${ 3000 }`);
    })


  }
}
