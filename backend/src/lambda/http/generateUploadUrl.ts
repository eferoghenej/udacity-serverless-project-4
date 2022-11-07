import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
// import * as middy from 'middy'
// import { cors, httpErrorHandler } from 'middy/middlewares'

import * as uuid from "uuid"

import { addAttachmentToTodo, createUploadUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = 
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId = getUserId(event)
    const attachmentId = uuid.v4()

    try {
      const uploadUrl = await createUploadUrl(attachmentId)
      await addAttachmentToTodo(userId, todoId, attachmentId)
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          uploadUrl: uploadUrl
        })
      }
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "An error occured when trying to generate upload url, please try again"
        })
      }
    }
  }


// handler
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true
//     })
//   )
