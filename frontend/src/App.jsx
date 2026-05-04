import { useEffect, useMemo, useState } from 'react';
import { Check, Loader2, Pencil, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { taskApi } from './services/api.js';

const initialForm = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium'
};

const statuses = ['pending', 'in-progress', 'completed'];
const priorities = ['low', 'medium', 'high'];

const toDateInputValue = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  return new Date(dateValue).toISOString().slice(0, 10);
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [editForm, setEditForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: statusFilter || undefined
    }),
    [search, statusFilter]
  );

  const loadTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await taskApi.getAll(filters);
      setTasks(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(loadTasks, 250);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Task title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        dueDate: form.dueDate || null
      };
      const response = await taskApi.create(payload);
      setTasks((current) => [response.data.data, ...current]);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.errors?.[0] || err.response?.data?.message || 'Unable to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (task, nextStatus) => {
    const previousTasks = tasks;
    setTasks((current) =>
      current.map((item) => (item._id === task._id ? { ...item, status: nextStatus } : item))
    );

    try {
      const response = await taskApi.updateStatus(task._id, nextStatus);
      setTasks((current) =>
        current.map((item) => (item._id === task._id ? response.data.data : item))
      );
    } catch (err) {
      setTasks(previousTasks);
      setError(err.response?.data?.message || 'Unable to update task status');
    }
  };

  const handleStartEdit = (task) => {
    setEditingId(task._id);
    setEditForm({
      title: task.title,
      description: task.description || '',
      dueDate: toDateInputValue(task.dueDate),
      priority: task.priority
    });
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId('');
    setEditForm(initialForm);
  };

  const handleUpdateSubmit = async (event, task) => {
    event.preventDefault();

    if (!editForm.title.trim()) {
      setError('Task title is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await taskApi.update(task._id, {
        ...editForm,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        dueDate: editForm.dueDate || null,
        status: task.status
      });
      setTasks((current) =>
        current.map((item) => (item._id === task._id ? response.data.data : item))
      );
      handleCancelEdit();
    } catch (err) {
      setError(err.response?.data?.errors?.[0] || err.response?.data?.message || 'Unable to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const previousTasks = tasks;
    setTasks((current) => current.filter((task) => task._id !== id));

    try {
      await taskApi.remove(id);
    } catch (err) {
      setTasks(previousTasks);
      setError(err.response?.data?.message || 'Unable to delete task');
    }
  };

  const completedCount = tasks.filter((task) => task.status === 'completed').length;

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Task Board</p>
            <h1>To-Do List</h1>
          </div>
          <div className="stats" aria-label="Task completion summary">
            <strong>{completedCount}</strong>
            <span>of {tasks.length} done</span>
          </div>
        </header>

        <section className="task-composer" aria-label="Create a task">
          <form onSubmit={handleSubmit}>
            <div className="field title-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Add a task"
                maxLength="120"
              />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional details"
                rows="3"
                maxLength="500"
              />
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="dueDate">Due date</label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="priority">Priority</label>
                <select id="priority" name="priority" value={form.priority} onChange={handleChange}>
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="primary-action" disabled={saving}>
                {saving ? <Loader2 className="spin" size={18} /> : <Plus size={18} />}
                Add Task
              </button>
            </div>
          </form>
        </section>

        <section className="controls" aria-label="Task filters">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks"
            />
          </div>
          <div className="status-tabs" role="tablist" aria-label="Filter by status">
            <button className={!statusFilter ? 'active' : ''} onClick={() => setStatusFilter('')}>
              All
            </button>
            {statuses.map((status) => (
              <button
                key={status}
                className={statusFilter === status ? 'active' : ''}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        {error && <p className="error-message">{error}</p>}

        <section className="task-list" aria-live="polite">
          {loading ? (
            <div className="state-message">
              <Loader2 className="spin" size={20} />
              Loading tasks
            </div>
          ) : tasks.length === 0 ? (
            <div className="state-message">No tasks found</div>
          ) : (
            tasks.map((task) => {
              const isEditing = editingId === task._id;

              return (
                <article className={`task-card ${task.status}`} key={task._id}>
                  {isEditing ? (
                    <form className="edit-form" onSubmit={(event) => handleUpdateSubmit(event, task)}>
                      <div className="field">
                        <label htmlFor={`edit-title-${task._id}`}>Title</label>
                        <input
                          id={`edit-title-${task._id}`}
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          maxLength="120"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`edit-description-${task._id}`}>Description</label>
                        <textarea
                          id={`edit-description-${task._id}`}
                          name="description"
                          value={editForm.description}
                          onChange={handleEditChange}
                          rows="2"
                          maxLength="500"
                        />
                      </div>
                      <div className="edit-grid">
                        <div className="field">
                          <label htmlFor={`edit-due-${task._id}`}>Due date</label>
                          <input
                            id={`edit-due-${task._id}`}
                            name="dueDate"
                            type="date"
                            value={editForm.dueDate}
                            onChange={handleEditChange}
                          />
                        </div>
                        <div className="field">
                          <label htmlFor={`edit-priority-${task._id}`}>Priority</label>
                          <select
                            id={`edit-priority-${task._id}`}
                            name="priority"
                            value={editForm.priority}
                            onChange={handleEditChange}
                          >
                            {priorities.map((priority) => (
                              <option key={priority} value={priority}>
                                {priority}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button type="submit" className="primary-action" disabled={saving}>
                          {saving ? <Loader2 className="spin" size={18} /> : <Save size={18} />}
                          Save
                        </button>
                        <button type="button" className="secondary-action" onClick={handleCancelEdit}>
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="task-main">
                        <button
                          className="status-toggle"
                          title="Mark as completed"
                          onClick={() => handleStatusChange(task, 'completed')}
                        >
                          <Check size={18} />
                        </button>
                        <div>
                          <h2>{task.title}</h2>
                          {task.description && <p>{task.description}</p>}
                          <div className="meta">
                            <span>{task.priority} priority</span>
                            {task.dueDate && (
                              <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="task-actions">
                        <select
                          value={task.status}
                          onChange={(event) => handleStatusChange(task, event.target.value)}
                          aria-label={`Update status for ${task.title}`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button className="icon-action" title="Edit task" onClick={() => handleStartEdit(task)}>
                          <Pencil size={18} />
                        </button>
                        <button
                          className="icon-action danger"
                          title="Delete task"
                          onClick={() => handleDelete(task._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })
          )}
        </section>
      </section>
    </main>
  );
}

export default App;
