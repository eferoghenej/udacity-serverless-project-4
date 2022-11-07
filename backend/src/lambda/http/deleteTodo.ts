import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const id = getUserId(event)
    
    try {
      await deleteTodo(id, todoId)
      logger.info(`Todo:${todoId} was successfully deleted by user ${id} at ${new Date().toISOString}`)
    } catch (e) {
      logger.info(`Todo:${todoId} delete request by user ${id} failed at ${new Date().toISOString}`)
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "An error occured while trying to delete the following object",
          object: {
            todoId,
          }
        })
      }
    }
    
    
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: ""
    }
  }
  


// handler
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )
