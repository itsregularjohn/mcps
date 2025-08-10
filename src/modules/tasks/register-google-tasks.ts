import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"

import { getErrorMessage } from "../../utils/index.ts"
import {
  completeTask,
  completeTaskInputSchema,
  createSubtask,
  createSubtaskInputSchema,
  createTask,
  createTaskInputSchema,
  createTaskList,
  createTaskListInputSchema,
  deleteTask,
  deleteTaskInputSchema,
  deleteTaskList,
  deleteTaskListInputSchema,
  listTaskLists,
  listTaskListsInputSchema,
  listTasks,
  listTasksInputSchema,
  updateTask,
  updateTaskInputSchema,
  updateTaskList,
  updateTaskListInputSchema
} from "./functions/index.ts"

export const registerGoogleTasks = (server: McpServer) => {
  server.tool(
    "list_task_lists",
    "List all task lists from Google Tasks.",
    listTaskListsInputSchema.shape,
    async (input) => {
      try {
        const taskLists = await listTaskLists(input)
        const formattedTaskLists = taskLists
          .map((taskList) => `• ${taskList.title} (ID: ${taskList.id})`)
          .join("\\n")

        return {
          content: [
            {
              type: "text",
              text: taskLists.length
                ? `Found ${taskLists.length} task lists:\\n\\n${formattedTaskLists}`
                : "No task lists found."
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing task lists: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "create_task_list",
    "Create a new task list in Google Tasks.",
    createTaskListInputSchema.shape,
    async (input) => {
      try {
        const taskList = await createTaskList(input)
        return {
          content: [
            {
              type: "text",
              text: `Task list "${input.title}" created successfully!\\nID: ${taskList.id}`
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating task list: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "update_task_list",
    "Update an existing task list in Google Tasks.",
    updateTaskListInputSchema.shape,
    async (input) => {
      try {
        await updateTaskList(input)
        return {
          content: [
            {
              type: "text",
              text: `Task list "${input.title}" updated successfully!`
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating task list: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "delete_task_list",
    "Delete a task list from Google Tasks.",
    deleteTaskListInputSchema.shape,
    async (input) => {
      try {
        await deleteTaskList(input)
        return {
          content: [
            {
              type: "text",
              text: "Task list deleted successfully!"
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error deleting task list: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "list_tasks",
    "List tasks from a specific task list in Google Tasks.",
    listTasksInputSchema.shape,
    async (input) => {
      try {
        const tasks = await listTasks(input)

        if (tasks.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "No tasks found in this task list."
              }
            ]
          }
        }

        const formattedTasks = tasks
          .map((task) => {
            const status = task.status === "completed" ? "✓" : "○"
            const indent = task.parent ? "  " : ""
            const due = task.due
              ? `(Due: ${new Date(task.due).toLocaleDateString()})`
              : ""
            const notes = task.notes ? `\\n${indent}  Notes: ${task.notes}` : ""
            const webLink = task.webViewLink ? `\\n${indent}  🔗 Open in Google Tasks: ${task.webViewLink}` : ""

            return `${indent}${status} ${task.title} ${due}\\n${indent}  ID: ${task.id}${notes}${webLink}`
          })
          .join("\\n\\n")

        return {
          content: [
            {
              type: "text",
              text: `Found ${tasks.length} tasks:\\n\\n${formattedTasks}`
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error listing tasks: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "create_task",
    "Create a new task in a task list in Google Tasks.",
    createTaskInputSchema.shape,
    async (input) => {
      try {
        const task = await createTask(input)
        const parentText = input.parent ? " as a subtask" : ""
        return {
          content: [
            {
              type: "text",
              text: `Task "${input.title}" created successfully${parentText}!\\nID: ${task.id}`
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating task: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "update_task",
    "Update an existing task in Google Tasks.",
    updateTaskInputSchema.shape,
    async (input) => {
      try {
        await updateTask(input)
        return {
          content: [
            {
              type: "text",
              text: "Task updated successfully!"
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error updating task: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "complete_task",
    "Mark a task as completed in Google Tasks.",
    completeTaskInputSchema.shape,
    async (input) => {
      try {
        const task = await completeTask(input)
        return {
          content: [
            {
              type: "text",
              text: `Task "${task.title}" marked as completed!`
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error completing task: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "delete_task",
    "Delete a task from Google Tasks.",
    deleteTaskInputSchema.shape,
    async (input) => {
      try {
        await deleteTask(input)
        return {
          content: [
            {
              type: "text",
              text: "Task deleted successfully!"
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error deleting task: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )

  server.tool(
    "create_subtask",
    "Create a subtask in Google Tasks.",
    createSubtaskInputSchema.shape,
    async (input) => {
      try {
        const subtask = await createSubtask(input)
        return {
          content: [
            {
              type: "text",
              text: `Subtask "${input.title}" created successfully!\\nID: ${subtask.id}`
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating subtask: ${getErrorMessage(error)}`
            }
          ]
        }
      }
    }
  )
}
