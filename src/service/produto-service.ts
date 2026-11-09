import { Page, Produto, ProdutoRequest } from "../types/produto";
import { del, get, post, put } from "./api";

export function getProdutos(pagina: number, filtro: string): Promise<Page<Produto>> {
  return get<Page<Produto>>(`/produtos/filtro?page=${pagina}&size=10&filtro=${filtro}`);
}

export function getByProdutoId(id: string): Promise<Produto> {
  return get<Produto>(`/produtos/${id}`);
}

export function postProduto(produto: ProdutoRequest): Promise<Produto> {
  return post<Produto>(`/produtos`, produto);
}

export function putProduto(id: string, produto: ProdutoRequest): Promise<Produto> {
  return put<Produto>(`/produtos/${id}`, produto);
}

export function deleteProduto(id: string): Promise<void> {
  return del(`/produtos/${id}`);
}

export function ultimaPagina(Page: Page<Produto>): boolean {
  return Page.page.number + 1 >= Page.page.totalPages;
}
