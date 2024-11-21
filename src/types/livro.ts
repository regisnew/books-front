import { Assunto } from './assunto'
import { Autor } from './autor'
import type { Item } from './item'

export interface Livro extends Item {
  titulo?: string;
  editora?: string;
  edicao?: number;
  anoPublicacao?: string;
  valor?: string;
  autors?: Autor[];
  assuntos?: Assunto[];
}
