import { spawn } from "child_process"

export const spawn_process = (path: string, args: Object): Promise<any> => {
  const pyProg = spawn("python", [path, JSON.stringify(args)])

  return new Promise((resolve, reject) => {
    pyProg.stdout.on("data", function (data) {
      resolve(data.toString())
    })

    pyProg.stdout.on("error", function (error) {
      reject(error.toString())
    })
  })
}
