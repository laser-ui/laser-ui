export interface Parser<V, O> {
  deserializer: (value: V) => O;
  serializer: (value: O) => V;
}

export interface AbstractParserOptions<V> {
  plain: Parser<V, string>;
  number: Parser<V, number>;
  json: Parser<V, any>;
}
