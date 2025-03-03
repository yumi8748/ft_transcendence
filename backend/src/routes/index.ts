import { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (fastify) => {
  // Get all tasks
  fastify.get('/api/tasks', async (request, reply) => {
    try {
      const tasks = await fastify.db.getTasks();
      return { success: true, data: tasks };
    } catch (error) {
      console.error(error);
      reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Get a specific task
  fastify.get<{ Params: { id: string } }>('/api/tasks/:id', async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      const task = await fastify.db.getTask(id);
      if (!task) {
        reply.code(404).send({ success: false, error: 'Task not found' });
        return;
      }
      return { success: true, data: task };
    } catch (error) {
      console.error(error);
      reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Create a new task
  fastify.post<{ Body: { title: string } }>('/api/tasks', async (request, reply) => {
    try {
      const { title } = request.body;
      if (!title || title.trim() === '') {
        reply.code(400).send({ success: false, error: 'Title is required' });
        return;
      }
      const task = await fastify.db.createTask(title);
      reply.code(201).send({ success: true, data: task });
    } catch (error) {
      console.error(error);
      reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Update a task's completion status
  fastify.put<{ Params: { id: string }, Body: { completed: boolean } }>(
    '/api/tasks/:id',
    async (request, reply) => {
      try {
        const id = parseInt(request.params.id);
        const { completed } = request.body;
        if (completed === undefined) {
          reply.code(400).send({ success: false, error: 'Completed status is required' });
          return;
        }
        const task = await fastify.db.updateTask(id, completed);
        if (!task) {
          reply.code(404).send({ success: false, error: 'Task not found' });
          return;
        }
        return { success: true, data: task };
      } catch (error) {
        console.error(error);
        reply.code(500).send({ success: false, error: 'Internal server error' });
      }
    }
  );

  // Delete a task
  fastify.delete<{ Params: { id: string } }>('/api/tasks/:id', async (request, reply) => {
    try {
      const id = parseInt(request.params.id);
      await fastify.db.deleteTask(id);
      return { success: true };
    } catch (error) {
      console.error(error);
      reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });
};

export default routes;