import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ 
    type: 'enum', 
    enum: ['admin', 'issuer', 'user'],
    default: 'user' 
  })
  role: 'admin' | 'issuer' | 'user';

  @Column({ nullable: true })
  blockchainAddress: string;  // THÊM trường này

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}