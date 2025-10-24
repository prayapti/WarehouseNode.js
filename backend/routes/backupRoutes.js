import express from 'express';
import { createManualBackup } from '../controller/backupController.js';

const router = express.Router();

router.post('/manual', createManualBackup);

export default router;
