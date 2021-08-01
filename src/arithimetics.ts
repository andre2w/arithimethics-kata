const operations: Record<string, (left: number, right:number) => number> = {
  "+": (left: number, right: number) => left + right,
  "-": (left: number, right: number) => left - right,
  "/": (left: number, right: number) => left / right,
  "*": (left: number, right: number) => left * right,
}

const signals = new Set(["+", "-", "/", "*"]);

export function calculate(operation: string): number {
  if (operation.length === 3) {
    return parseInt(operation.charAt(1));
  }

  let left: string = "";
  let right: string = "";
  let signal: string = "";

  for (let i = 0; i < operation.length; i++) {
    const char = operation.charAt(i);
    
    if (!isValid(char)) {
      continue;
    }

    if (!signals.has(char)) {
      if (signal === "") {
        left = left + char;
      } else {
        right = right + char;
      }
    } else {
      signal = char;
    }
  }

  if (signal === "/" && parseInt(right) === 0) {
    throw new Error("division by zero not allowed");
  }
  return operations[signal](parseInt(left), parseInt(right));
}


function isValid(char: string): boolean {
  const res = parseInt(char);

  if (isNaN(res)) {
    return signals.has(char);
  }

  return true;
}