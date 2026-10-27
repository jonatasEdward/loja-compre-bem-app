import { Page, Produto } from "../types/produto";
import { get } from "./api";

export function getProdutos(pagina: number, filtro: string): Promise<Page<Produto>> {
  return get<Page<Produto>>(`/produtos/filtro?page=${pagina}&size=20&filtro=${filtro}`);
}

export function getByProdutoId(id: number): Promise<Produto> {
  return get<Produto>(`/produtos/${id}`);
}
