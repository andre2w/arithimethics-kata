const operations: Record<string, (left: number, right:number) => number> = {
  "+": (left: number, right: number) => left + right,
  "-": (left: number, right: number) => left - right,
  "/": (left: number, right: number) => {
    if (right === 0) throw new Error("Division by 0");
    return left / right;
  },
  "*": (left: number, right: number) => left * right,
}

const signals = new Set(["+", "-", "/", "*"]);

const priorities = [["*", "/"], ["+", "-"]];

export function calculate(operation: string): number {
  const values = parse(operation);

  if (values.length === 1) {
    return values[0] as number;
  }
  

  for (let priorityIndex = 0; priorityIndex < priorities.length; priorityIndex++) {
    for (let i = 0; i < values.length; i++) {
      const curr = values[i];
      if (typeof curr === "string") {
        const result = operations[curr](values[i-1] as number, values[i+1] as number);
        values.splice(i-1, 3, result);
        i--;
      }
    }
  }
  return values[0] as number;
}

function parse(operation: string): (number|string)[] {
  const values: (number|string)[] = [];

  let currentValue = "";
  for (let i = 0; i < operation.length; i++) {
    const char = operation.charAt(i);

    if (signals.has(char) && operation.charAt(i+1) === " ") {
      values.push(char);
    } else if (char === " ") {
      const value = parseInt(currentValue);
      if (!isNaN(value)) {
        values.push(value);
      }
      currentValue = "";
    } else if (char !== "(" && char !== ")") {
      currentValue += char;
    }
  }

  return values;
}