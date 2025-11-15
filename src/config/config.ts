import Joi from 'joi'

// Define a schema to validate the environment variables
const envSchema = Joi.object({
  VITE_APP_URL: Joi.string().uri().required(),
  VITE_API_ROOT: Joi.string().uri().required(),
  VITE_CASHFREE_APP_ID: Joi.string().required(),
  VITE_CASHFREE_APP_SECRET: Joi.string().required(),
}).unknown()

const envVars = {
  VITE_APP_URL: import.meta.env.VITE_APP_URL,
  VITE_API_ROOT: import.meta.env.VITE_API_ROOT,
  VITE_CASHFREE_APP_ID: import.meta.env.VITE_CASHFREE_APP_ID,
  VITE_CASHFREE_APP_SECRET: import.meta.env.VITE_CASHFREE_APP_SECRET,
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
