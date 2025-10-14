import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Certificate } from './certificate.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: ['admin', 'issuer', 'user'] })
  role: 'admin' | 'issuer' | 'user';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Certificate, certificate => certificate.issuer)
  issuedCertificates: Certificate[];

  @OneToMany(() => Certificate, certificate => certificate.recipient)
  receivedCertificates: Certificate[];
}