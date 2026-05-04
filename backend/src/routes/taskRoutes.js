import { Router } from 'express';
import {
  addTask,
  changeTaskStatus,
  editTask,
  fetchTaskById,
  fetchTasks,
  removeTask
} from '../controllers/taskController.js';
import { validateTask, validateTaskStatus } from '../validators/taskValidator.js';

const router = Router();

router.route('/').get(fetchTasks).post(validateTask, addTask);
router
  .route('/:id')
  .get(fetchTaskById)
  .put(validateTask, editTask)
  .delete(removeTask);
router.patch('/:id/status', validateTaskStatus, changeTaskStatus);

export default router;
