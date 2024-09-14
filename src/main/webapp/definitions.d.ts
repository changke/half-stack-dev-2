interface IUIVariable {
  pageInfo: {
    brand: string;
    lang: string;
  };
}

declare global {
  interface Window {
    ui: IUIVariable;
  }
}

export {};
