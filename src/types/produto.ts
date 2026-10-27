export type Produto = {
      produtoId?: string;
      nome?: string;
      descricao?: string;
      preco: number;
      quantidade?: number;
      imagem?: string;
      categoria?: string;
};

export type Page<T> = {
      content: T[];
      page: {
            size: number;
            totalElements: number;
            totalPages: number;
            number: number;
      }
}
