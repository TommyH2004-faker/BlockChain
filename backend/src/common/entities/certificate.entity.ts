import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('certificate')
export class Certificate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ unique: true })
  credentialID: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  grade: string;

  @Column({ nullable: true })
  type: string;

  @Column({ type: 'longtext', nullable: true })
  image: string;

  @Column({ nullable: true })
  blockchainTxId: string;

  @Column({ nullable: true })
  blockchainCertId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  issuerId: string;

  @Column()
  recipientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'issuerId' })
  issuer: User;
  @Column( { default: false })
  blockchainVerified: boolean;
  @ManyToOne(() => User)
  @JoinColumn({ name: 'recipientId' })
  recipient: User;
}