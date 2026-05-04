import mongoose from 'mongoose';
import Task from '../models/taskModel.js';

const buildTaskQuery = ({ search, status, priority }) => {
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  return query;
};

export const getTasks = async (filters) => {
  const query = buildTaskQuery(filters);
  return Task.find(query).sort({ createdAt: -1 });
};

export const getTaskById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Task.findById(id);
};

export const createTask = async (taskData) => Task.create(taskData);

export const updateTask = async (id, taskData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Task.findByIdAndUpdate(id, taskData, {
    new: true,
    runValidators: true
  });
};

export const deleteTask = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return Task.findByIdAndDelete(id);
};
