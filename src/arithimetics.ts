export function calculate(operation: string): number {
  if (operation.length === 3) {
    return parseInt(operation.charAt(1));
  }

  if (operation.charAt(2) === "+") {
    return parseInt(operation.charAt(1)) + parseInt(operation.charAt(3));
  } else {
    return parseInt(operation.charAt(1)) - parseInt(operation.charAt(3));
  }
}
