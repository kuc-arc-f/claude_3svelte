
import express from 'express';
import { drizzle } from 'drizzle-orm/libsql';
const app = express();
import 'dotenv/config';
import { eq, like } from 'drizzle-orm';
//import { db } from './db';
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

// TODOの全件取得
app.get('/api/todos', async (req, res) => {
  try {
    const { search } = req.query;
    let result;
    
    if (search) {
      // 検索機能の実装
      result = await db.select()
        .from(todos)
        .where(like(todos.title, `%${search}%`))
        .orderBy(todos.createdAt);
    } else {
      result = await db.select().from(todos).orderBy(todos.createdAt);
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO の取得（ID指定）
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.select()
      .from(todos)
      .where(eq(todos.id, parseInt(id)))
      .limit(1);
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO の作成
app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const result = await db.insert(todos)
      .values({
        title,
        description,
        completed: false,
      })
      .returning();
    
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO の更新
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const result = await db.update(todos)
      .set({
        title,
        description,
        completed,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, parseInt(id)))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// TODO の削除
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.delete(todos)
      .where(eq(todos.id, parseInt(id)))
      .returning();
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
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
