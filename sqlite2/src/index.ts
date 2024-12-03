
import express from 'express';
import { drizzle } from 'drizzle-orm/libsql';
const app = express();
import 'dotenv/config';
import { eq, like } from 'drizzle-orm';
import { todos } from './db/schema';
const db = drizzle(process.env.DB_FILE_NAME!);

//
import { htmlSend } from './lib/RenderUtil'
import App from './pages/App.svelte';
//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
console.log("env=", process.env.NODE_ENV)
console.log("DB_FILE_NAME=", process.env.DB_FILE_NAME);
//
const errorObj = {ret: "NG", messase: "Error"};
// API

// Create TODO
app.post('/api/todos', async (req, res) => {
  try {
console.log(req.body);
    const todo = {
      ...req.body,
      created_at: new Date().toISOString()
    };
    
    const result = await db.insert(todos).values(todo);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read all TODOs
app.get('/api/todos', async (req, res) => {
  try {
    const { search } = req.query;
    let query = db.select().from(todos);
    
    if (search) {
      query = query.where(like(todos.title, `%${search}%`));
    }
    
    const result = await query;
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Read single TODO
app.get('/api/todos/:id', async (req, res) => {
  try {
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.id, parseInt(req.params.id)));
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update TODO
app.put('/api/todos/:id', async (req, res) => {
  try {
    console.log("#Update TODO");
    const result = await db
      .update(todos)
      .set(req.body)
      .where(eq(todos.id, parseInt(req.params.id)));
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete TODO
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const result = await db
      .delete(todos)
      .where(eq(todos.id, parseInt(req.params.id)));
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//SPA
app.get('/*', async (req: any, res: any) => {
  try {
    const rendered = await App.render();
    res.send(htmlSend(rendered.html));
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

//start
const PORT = 3000;
app.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}`);
});
console.log('start');
