export class UserResponseDto {
  constructor(
    private readonly message: string,
    private readonly data: Array<Object>
  ) {}
}
