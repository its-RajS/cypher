import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns a public service health response', () => {
    expect(new HealthController().getHealth()).toEqual({
      status: 'ok',
      service: 'cypher-api',
    });
  });
});
