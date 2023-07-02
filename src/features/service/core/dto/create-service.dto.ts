import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';


export class CreateServiceDto {

    @ApiProperty()
    @IsString()
    @IsUUID()
    @IsNotEmpty()
    clientId: string;


    @ApiProperty({ example: 'Pantalla lcd dañada' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    direction: string;


    @ApiProperty({ example: '2023/12/01' })
    @IsString()
    @IsNotEmpty()
    date_to_attend: string;

}
