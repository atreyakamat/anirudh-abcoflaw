import { Controller } from '@nestjs/common';
import { CrudController } from '../../common/crud/crud.controller.js';
import { SettingsService } from './settings.service.js';

@Controller('settings')
export class SettingsController extends CrudController {
  constructor(service: SettingsService) {
    super(service);
  }
}