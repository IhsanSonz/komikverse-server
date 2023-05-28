/* example using https://github.com/dougmoscrop/serverless-http */
import serverless from 'serverless-http'
import api from './api'

// We need to define our function name for express routes to set the correct base path
const functionName = 'serverless'

// Initialize express app
const app = api(functionName)

// Export lambda handler
export const handler = serverless(app)
