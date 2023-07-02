import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';



export class UpdateServiceDto  {


    @ApiProperty({ example: 'Pantalla lcd dañada' })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    direction: string;


    @ApiProperty({ example: '2023/12/01' })
    @IsString()
    @IsOptional()
    date_to_attend: string;

}
