# petit-scanner

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
