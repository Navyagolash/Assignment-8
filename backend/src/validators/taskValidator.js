const validStatuses = ['pending', 'in-progress', 'completed'];
const validPriorities = ['low', 'medium', 'high'];

const sendValidationError = (res, errors) =>
  res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });

export const validateTask = (req, res, next) => {
  const errors = [];
  const { title, description, status, dueDate, priority } = req.body;

  if (req.method === 'POST' && (!title || !title.trim())) {
    errors.push('Title is required');
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length < 2) {
      errors.push('Title must be at least 2 characters long');
    }
  }

  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string');
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  if (priority !== undefined && !validPriorities.includes(priority)) {
    errors.push(`Priority must be one of: ${validPriorities.join(', ')}`);
  }

  if (dueDate !== undefined && dueDate !== null && Number.isNaN(Date.parse(dueDate))) {
    errors.push('Due date must be a valid date');
  }

  if (errors.length > 0) {
    return sendValidationError(res, errors);
  }

  return next();
};

export const validateTaskStatus = (req, res, next) => {
  const { status } = req.body;

  if (!validStatuses.includes(status)) {
    return sendValidationError(res, [
      `Status is required and must be one of: ${validStatuses.join(', ')}`
    ]);
  }

  return next();
};
