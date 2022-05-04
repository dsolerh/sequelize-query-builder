import { INNM_REGX, OP_REGX } from '../../src/regex';

describe('test regexp for query', () => {
  test.each`
    val        | ret
    ${'abc'}   | ${false}
    ${'$abc'}  | ${true}
    ${'$12'}   | ${false}
    ${'$abc$'} | ${false}
    ${'$a_bc'} | ${false}
    ${'$a1bc'} | ${false}
  `('OP_REGX', ({ val, ret }) => {
    expect(OP_REGX.test(val)).toBe(ret);
  });

  test.each`
    val          | ret
    ${'$a.bc$'}  | ${true}
    ${'$a.b.c$'} | ${true}
    ${'$abc'}    | ${false}
    ${'$abc$'}   | ${false}
  `('INNM_REGX', ({ val, ret }) => {
    expect(INNM_REGX.test(val)).toBe(ret);
  });
});
