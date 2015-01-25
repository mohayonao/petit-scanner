# petit-scanner
[![Build Status](http://img.shields.io/travis/mohayonao/scanner.svg?style=flat)](https://travis-ci.org/mohayonao/scanner)

## API

### Scanner

 - `Scanner(str:string = "")`

#### Instance methods

  - `hasNext(): boolean`
  - `peek(): string`
  - `next(): string`
  - `match(matcher: string|RegExp): boolean`
  - `expect(matcher: string|RegExp): void throws SyntaxError`
  - `scan(matcher: string|RegExp): string`
  - `skipComment(): void throws SyntaxError`

## License

MIT
