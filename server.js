/* example using https://github.com/dougmoscrop/serverless-http */
import { createServer, proxy } from 'aws-serverless-express'
import api from './api/index.js'

// We need to define our function name for express routes to set the correct base path
const functionName = 'serverless'

// Initialize express app
const app = api(functionName)
const server = createServer(app)

// Export lambda handler
export const handler = (event, context) => {
  return proxy(server, event, context)
}
