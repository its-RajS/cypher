import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
}
