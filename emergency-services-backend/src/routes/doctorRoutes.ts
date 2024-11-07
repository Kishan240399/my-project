import { Router, Request, Response } from 'express';
import db from '../database';
import { Doctor } from '../models';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM doctors', (err, rows: Doctor[]) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

router.post('/', (req: Request, res: Response) => {
  const { name, specialization } = req.body;
  db.run(
    'INSERT INTO doctors (name, specialization) VALUES (?, ?)',
    [name, specialization],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.status(201).json({ id: this.lastID, name, specialization });
    }
  );
});

router.delete('/:id', (req: Request, res: Response) => {
  db.run('DELETE FROM doctors WHERE id = ?', req.params.id, function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Doctor deleted' });
  });
});

router.put('/:id', (req: Request, res: Response) => {
  const { name, specialization } = req.body;
  db.run(
    'UPDATE doctors SET name = ?, specialization = ? WHERE id = ?',
    [name, specialization, req.params.id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: req.params.id, name, specialization });
    }
  );
});

export default router;
