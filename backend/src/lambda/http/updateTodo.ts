import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodo')

export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const id = getUserId(event)
    try {
      await updateTodo(id, todoId, updatedTodo)
      logger.info(`Todo:${todoId} was successfully updated by user ${id} at ${new Date().toISOString}`)
    } catch (e) {
      logger.info(`Todo:${todoId} update request by user ${id} failed at ${new Date().toISOString}`)
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "An error occured when trying to update the following object",
          object: {
            todoId,
            todo: updatedTodo
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
