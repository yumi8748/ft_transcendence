
const registerSchema = {
  schema: {
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['username', 'password']
    }
  }
};

const tokenResponseSchema = {
  type: 'object',
  body: {
    type: 'object',
    properties: {
      token: { type: 'string' }
    }
  }
};

const loginSchema = {
  type: 'object',
  oneOf: [
    {
      body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
        }
      }
    },
    {
      body: {
        type: 'object',
        required: [ 'Authorization' ],
        properties: {
          Authorization: { type: 'string' }
        }
      }
    }
  ]
};

const loginResponseSchema = {
    type: 'object',
    properties: {
        token: { type: 'string' }
    }
};

export default {
  registerSchema,
  tokenResponseSchema,
  loginSchema,
  loginResponseSchema
};