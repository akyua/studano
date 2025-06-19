export class DatabaseLogger {
  private static formatObject(obj: any): string {
    if (obj === null || obj === undefined) {
      return "null";
    }

    if (typeof obj === "string") {
      return obj;
    }

    if (typeof obj === "number" || typeof obj === "boolean") {
      return obj.toString();
    }

    if (obj._id) {
      return `{ id: "${obj._id.toString()}", ... }`;
    }

    if (Array.isArray(obj)) {
      return `[${obj.length} items]`;
    }

    if (typeof obj === "object") {
      const keys = Object.keys(obj);
      if (keys.length === 0) return "{}";

      const formatted = keys
        .map((key) => {
          const value = obj[key];
          if (value && typeof value === "object" && value._id) {
            return `${key}: { id: "${value._id.toString()}" }`;
          }
          if (Array.isArray(value)) {
            return `${key}: [${value.length} items]`;
          }
          return `${key}: ${JSON.stringify(value)}`;
        })
        .join(", ");

      return `{ ${formatted} }`;
    }

    return JSON.stringify(obj);
  }

  static logOperation(
    repository: string,
    method: string,
    request?: any,
    result?: any,
    error?: any,
  ) {
    if (!__DEV__) return;

    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];

    if (error) {
      console.log(`❌ [${timestamp}] [${repository}] ${method} - ERROR:`, error);
      return;
    }

    if (request && result) {
      console.log(
        `🔵 [${timestamp}] [${repository}] ${method} - REQUEST:`,
        this.formatObject(request),
      );
      console.log(
        `✅ [${timestamp}] [${repository}] ${method} - RESULT:`,
        this.formatObject(result),
      );
    } else if (request) {
      console.log(
        `🔵 [${timestamp}] [${repository}] ${method} - REQUEST:`,
        this.formatObject(request),
      );
    } else if (result) {
      console.log(
        `✅ [${timestamp}] [${repository}] ${method} - RESULT:`,
        this.formatObject(result),
      );
    } else {
      console.log(`🔵 [${timestamp}] [${repository}] ${method}`);
    }
  }

  static logHook(hook: string, method: string, request?: any, result?: any, error?: any) {
    if (!__DEV__) return;

    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];

    if (error) {
      console.log(`❌ [${timestamp}] [${hook}] ${method} - ERROR:`, error);
      return;
    }

    if (request && result) {
      console.log(`🔵 [${timestamp}] [${hook}] ${method} - REQUEST:`, this.formatObject(request));
      console.log(`✅ [${timestamp}] [${hook}] ${method} - RESULT:`, this.formatObject(result));
    } else if (request) {
      console.log(`🔵 [${timestamp}] [${hook}] ${method} - REQUEST:`, this.formatObject(request));
    } else if (result) {
      console.log(`✅ [${timestamp}] [${hook}] ${method} - RESULT:`, this.formatObject(result));
    } else {
      console.log(`🔵 [${timestamp}] [${hook}] ${method}`);
    }
  }
}

