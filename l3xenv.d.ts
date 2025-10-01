import { PathLike } from 'fs';

export interface DotenvConfigOptions {
  /**
   * Ruta absoluta o relativa al archivo .env. Si no se especifica, l3xenv buscará automáticamente en la carpeta del script principal y luego en el cwd.
   */
  path?: PathLike;
  encoding?: string;
}
export interface DotenvConfigOutput {
  error?: Error;
  parsed?: Record<string, string>;
}
export function config(options?: DotenvConfigOptions): DotenvConfigOutput;
export function parse(src: string): Record<string, string>;

export interface DotenvConfigOptions {
  /**
   * Ruta absoluta o relativa al archivo .env. Si no se especifica, l3xenv buscará automáticamente en la carpeta del script principal y luego en el cwd.
   */
  path?: PathLike;
  encoding?: string;
}
export interface DotenvConfigOutput {
  error?: Error;
  parsed?: Record<string, string>;
}
export function config(options?: DotenvConfigOptions): DotenvConfigOutput;
export function parse(src: string): Record<string, string>;
