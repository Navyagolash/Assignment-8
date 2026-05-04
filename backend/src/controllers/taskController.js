import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask
} from '../services/taskService.js';

export const fetchTasks = async (req, res, next) => {
  try {
    const tasks = await getTasks({
      search: req.query.search,
      status: req.query.status,
      priority: req.query.priority
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

export const fetchTaskById = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return next(error);
  }
};

export const addTask = async (req, res, next) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

export const editTask = async (req, res, next) => {
  try {
    const task = await updateTask(req.params.id, req.body);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return next(error);
  }
};

export const changeTaskStatus = async (req, res, next) => {
  try {
    const task = await updateTask(req.params.id, { status: req.body.status });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return next(error);
  }
};

export const removeTask = async (req, res, next) => {
  try {
    const task = await deleteTask(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (error) {
    return next(error);
  }
};
