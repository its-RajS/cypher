import { Controller, Get, HttpCode, VERSION_NEUTRAL } from '@nestjs/common';

@Controller({ path: '', version: VERSION_NEUTRAL })
export class HealthController {
  @Get()
  @HttpCode(200)
  getHealth() {
    return {
      status: 'ok',
      service: 'cypher-api',
    };
  }
}
