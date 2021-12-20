import { Pagination } from '../types/pagination';
import { ResolverPagination } from '../types/resolvedPagination';

export class PaginationResolver {
  static parseResolvedPagination(
    resolvedPagination: ResolverPagination
  ): Pagination {
    const itemsPerPage = resolvedPagination.rows;
    const currentPage = resolvedPagination.page;
    return {
      itemsPerPage,
      currentPage,
    };
  }
}
