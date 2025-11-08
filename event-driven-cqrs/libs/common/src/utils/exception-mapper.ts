import {
  HttpStatus,
  HttpException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export function raiseHttpException(code: number, message: string): never {
  switch (code) {
    case HttpStatus.BAD_REQUEST:
      throw new BadRequestException(message);
    case HttpStatus.UNAUTHORIZED:
      throw new UnauthorizedException(message);
    case HttpStatus.FORBIDDEN:
      throw new ForbiddenException(message);
    case HttpStatus.NOT_FOUND:
      throw new NotFoundException(message);
    case HttpStatus.CONFLICT:
      throw new ConflictException(message);
    case HttpStatus.INTERNAL_SERVER_ERROR:
      throw new InternalServerErrorException(message);
    default:
      throw new HttpException(message || 'Unknown error', code || 500);
  }
}
