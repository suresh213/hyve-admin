import Joi from 'joi'

// Define a schema to validate the environment variables
const envSchema = Joi.object({
  VITE_APP_URL: Joi.string().uri().required(),
  VITE_API_ROOT: Joi.string().uri().required(),
}).unknown()

const envVars = {
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
  VITE_API_ROOT: import.meta.env.VITE_API_ROOT,
}

// Validate the environment variables against the schema
const { error, value: validatedEnv } = envSchema.validate(envVars)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export const config = {
  api: {
    url: validatedEnv.VITE_API_ROOT,
  },
  app: {
    url: validatedEnv.VITE_APP_URL,
  },
}
