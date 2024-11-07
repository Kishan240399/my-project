import { Router, Request, Response } from 'express';
import db from '../database';
import { Ambulance } from '../models';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  db.all('SELECT * FROM ambulances', (err, rows: Ambulance[]) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

router.post('/', (req: Request, res: Response) => {
  const { name, description, location } = req.body;
  db.run(
    'INSERT INTO ambulances (name, description, location) VALUES (?, ?, ?)',
    [name, description, location],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.status(201).json({ id: this.lastID, name, description, location });
    }
  );
});

router.delete('/:id', (req: Request, res: Response) => {
  db.run('DELETE FROM ambulances WHERE id = ?', req.params.id, function (err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ message: 'Ambulance deleted' });
  });
});

router.put('/:id', (req: Request, res: Response) => {
  const { name, description, location } = req.body;
  db.run(
    'UPDATE ambulances SET name = ?, description = ?, location = ? WHERE id = ?',
    [name, description, location, req.params.id],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: req.params.id, name, description, location });
    }
  );
});

export default router;
