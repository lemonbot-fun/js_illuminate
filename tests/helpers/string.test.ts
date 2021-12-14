import { noSMPChars } from '@/helpers/string';

test('noSMPChars() 测试', () => {
  expect(noSMPChars('𐀀🥳🯹')).toEqual('');
});
