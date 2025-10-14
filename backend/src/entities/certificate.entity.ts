import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  issueDate: string;

  @Column({ nullable: true })
  expiryDate: string;

  @Column()
  grade: string;

  @Column()
  type: string;

  @Column()
  credentialID: string;

  @Column({ nullable: true, type: 'text' })
  image: string;

  @Column({ nullable: true })
  blockchainTxId: string;
  
  @Column({ default: false })
  blockchainVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, user => user.issuedCertificates)
  @JoinColumn({ name: 'issuerId' })
  issuer: User;

  @Column()
  issuerId: string;

  @ManyToOne(() => User, user => user.receivedCertificates)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  @Column()
  recipientId: string;
}