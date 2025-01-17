// global.d.ts
declare global {
  namespace NodeJS {
    interface Global {
      _mongoClientPromise?: Promise<any>;  // You can refine the type based on your needs
    }
  }
}

export {};
