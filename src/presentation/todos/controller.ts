import { Request, Response } from "express"
import { prisma } from "../../data/postgres"
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos"


// const todos = [
//   { id: 1, text: 'Buy milk', completedAt: new Date() },
//   { id: 2, text: 'Buy bread', completedAt: null },
//   { id: 3, text: 'Buy coffe', completedAt: new Date() },
// ]

export class TodosController {
  // DI
  constructor() { }

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany()
    res.json(todos)
  }

  public getTodosId = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) return res.status(400).json({ error: `ID argument is not a number` });

    // const todo = todos.find(todo => todo.id === id);
    const todos = await prisma.todo.findFirst({
      where: { id: id }
    });

    (todos)
      ? res.json(todos)
      : res.status(404).json({ error: `Todo with id ${id} not found` })
  }

  public createTodo = async (req: Request, res: Response) => {

    const [error, createTodoDto] = CreateTodoDto.create(req.body)
    if ( error ) return res.status(400).json({ error })

    const todo = await prisma.todo.create({
      data: createTodoDto!
    })

    res.json(todo)
  }

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if ( error ) return res.status(400).json({ error })

    // const todo = todos.find(todo => todo.id === id);
    const todo = await prisma.todo.findFirst({
      where: { id: id }
    });
    if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });

    const todoUpdate = await prisma.todo.update({
      where: { id: id },
      data: updateTodoDto!.values
    });

    // todo.text = text || todo.text;
    // (completedAt === 'null')
    //   ? todo.completedAt = null
    //   : todo.completedAt = new Date(completedAt || todo.completedAt);


    res.json(todoUpdate)
  }

  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;

    // const todo = todos.find(todo => todo.id === id);

    const todo = await prisma.todo.findFirst({
      where: { id: id }
    });
    if (!todo) return res.status(404).json({ error: `Todo with id ${id} not found` });

    const deleted = await prisma.todo.delete({
      where: { id: id }
    });

    (deleted)
    ? res.json( deleted )
    : res.status(400).json({error: `Todo with id ${ id } not found`});

    // const newTodos = todos.filter(todo => todo.id === id);
    // todos.splice(todos.indexOf(todo), 1)

    // const del = todo.id
    // let borrar = -1
    // todos.forEach((todo, i) => {
    //   if  (todo.id === del) {
    //     borrar = i
    //   }
    // })
    // if (borrar >= 0) {
    //   todos.splice(borrar, 1)
    // }
    // console.log(todos)

    // res.json(todo)
  }
}

