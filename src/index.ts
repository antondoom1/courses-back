import express, { Request, Response } from 'express'

const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type MockDB = {
    courses: MockCourse[]
}

type MockCourse = {
    id: number
    title: string
}

const db: MockDB = {
    courses: [
        { id: 1, title: 'front-end' },
        { id: 2, title: 'back-end' },
        { id: 3, title: 'qa' },
        { id: 4, title: 'devops' }
    ]
}

app.get('/courses', (req: Request, res: Response) => {
    let foundCourses = db.courses

    if (req.query.title) {
        foundCourses = db.courses.filter(course => course.title.indexOf(req.query.title as string) > -1)
    }

    res.json(foundCourses)
})
app.get('/courses/:id', (req: Request, res: Response) => {
    const foundCourse = db.courses.find(course => course.id === +req.params.id)

    if (!foundCourse) {
        res.sendStatus(404)

        return
    }

    res.json(foundCourse)

})
app.post('/courses', (req: Request, res: Response) => {
    if (!req.body.title) {
        res.sendStatus(400)

        return
    }

    const newCourse = {
        id: +(new Date()),
        title: req.body.title
    }

    db.courses.push(newCourse)
    res.status(201).json(newCourse)
})
app.delete('/courses/:id', (req: Request, res: Response) => {
    const foundCourse = db.courses.find(course => course.id === +req.params.id)

    if (foundCourse) {
      const removed =  db.courses.splice(db.courses.indexOf(foundCourse), 1)

      res.status(200).json(removed[0])
    } else {
        res.sendStatus(404)
    }
})

app.put('/courses/:id', (req: Request, res: Response) => {
    if (!req.body.title) {
        res.sendStatus(400)

        return
    }

    const foundCourse = db.courses.find(course => course.id === +req.params.id)

    if (!foundCourse) {
      res.sendStatus(404)

      return
    }

    foundCourse.title = req.body.title

    res.sendStatus(204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
