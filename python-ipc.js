/**
 * Calls a function in the ipc.py Python file.
 * @param {function(string)} callback Called after the Python code.
 * @param {string} func The Python function to call.
 * @param {string|string[]} args Arguments to pass to the Python function.
 */
export function pythonipc(callback, func, args="") {
  var { PythonShell } = require("python-shell");

  if (typeof(args) === "string") {
    args = [func, args];
  } else {
    args = [func].concat(args);
  }
  
  PythonShell.run("./data/ipc.py", {
    args: args,
    mode: "json"
  }, function (err, results) {
    if (err) throw err;
    callback(results[0]);
  });
}