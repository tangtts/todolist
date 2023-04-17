
import { ApiProperty } from '@nestjs/swagger';


export class UploadDTO {

    @ApiProperty({ example: 'xxx' })
    name: string;

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File;

}