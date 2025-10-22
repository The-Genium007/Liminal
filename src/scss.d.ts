/**
 * TypeScript declaration file for SCSS modules
 * Allows importing .module.scss files with type safety
 */
declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const content: { [key: string]: string };
  export default content;
}

declare module '*.css' {
  const content: { [key: string]: string };
  export default content;
}
