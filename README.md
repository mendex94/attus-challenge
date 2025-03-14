# Aplicação de Gerenciamento de Produtos

Uma aplicação completa de gerenciamento de produtos construída com Angular 19, implementando princípios de Clean Architecture e melhores práticas de frontend.

## Funcionalidades

- **Gerenciamento de Produtos**: Operações CRUD completas (Criar, Ler, Atualizar, Excluir) para produtos
- **Produtos em Destaque**: Produtos podem ser marcados como "destacados" e exibidos com proeminência
- **Busca e Filtragem**: Produtos podem ser pesquisados por nome e filtrados por categoria
- **Design Responsivo**: Interface se adapta a diferentes tamanhos de tela
- **Dados em Tempo Real**: Utilizando TanStack Query para busca e cache eficiente de dados

## Arquitetura

Este projeto implementa Clean Architecture com separação clara de responsabilidades entre camadas. Cada camada é responsável por um aspecto específico da aplicação, facilitando manutenção e evolução:

### Camadas

1. **Camada de Repositório**: Gerencia acesso a dados e operações HTTP

   - `ProductRepository`: Comunica-se com a API backend

2. **Camada de Casos de Uso**: Contém a lógica de negócio

   - `GetProductsUseCase`: Gerencia a recuperação e filtragem de produtos
   - `CreateProductUseCase`: Gerencia a lógica de criação de produtos
   - `UpdateProductUseCase`: Gerencia a lógica de atualização de produtos

3. **Camada de Serviço**: Fachadas para casos de uso, consumidas pelos componentes

   - `ProductsService`: Serviço principal para operações de produtos
   - `ProductQueryService`: Gerencia integração com TanStack Query para busca de dados
   - `ProductMutationService`: Gerencia mutações para criar/atualizar produtos

4. **Camada de Apresentação**: Componentes e elementos de UI
   - Pages: Componentes de página completa (`ProductsPage`, `ProductCreatePage`, etc.)
   - Components: Elementos UI reutilizáveis (`ProductList`, `ProductForm`, etc.)

## Stack Tecnológica

- **Angular 19**: Framework principal com componentes standalone
- **PrimeNG**: Biblioteca de componentes UI
- **TanStack Query**: Para gerenciamento de estado e busca de dados
- **JSON Server**: API mock para backend
- **Tailwind CSS**: Para estilização
