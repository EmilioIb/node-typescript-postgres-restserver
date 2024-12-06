export class PaginationDto {
  private constructor(public readonly page: number, public readonly limit: number) {}

  static create(page: number = 1, limit: number = 10): [string?, PaginationDto?] {
    if (isNaN(page)) return ['Page should be a number'];
    if (isNaN(limit)) return ['Limit should be a number'];

    if (page <= 0) return ['Page must be grater than 0'];
    if (limit <= 0) return ['Limit must be grater than 0'];

    return [undefined, new PaginationDto(page, limit)];
  }
}
