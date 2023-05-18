import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ unique: true })
  @ApiProperty({ uniqueItems: true })
  username: string;

  @Column({ unique: true, nullable: true }) //todo : remove this
  @ApiProperty({ uniqueItems: true })
  email?: string;

  @Column({ select: false }) // prevent this column to appear in select
  @ApiProperty()
  password: string;
}
