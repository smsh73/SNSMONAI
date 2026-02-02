/**
 * Crypto Service
 * Encryption/decryption for sensitive data
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private readonly authTagLength = 16;
  private key: Buffer;

  constructor(private configService: ConfigService) {
    const secret = this.configService.get<string>('ENCRYPTION_KEY');
    if (!secret) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    // Derive a key from the secret
    this.key = crypto.scryptSync(secret, 'salt', this.keyLength);
  }

  /**
   * Encrypt a string
   */
  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Combine IV + AuthTag + Encrypted data
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  /**
   * Decrypt a string
   */
  decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format');
    }

    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Hash a string (one-way)
   */
  hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Generate a random string
   */
  generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Mask an API key for display
   */
  maskApiKey(apiKey: string): string {
    if (apiKey.length <= 8) {
      return '****';
    }
    const prefix = apiKey.substring(0, 4);
    const suffix = apiKey.substring(apiKey.length - 4);
    return `${prefix}****${suffix}`;
  }
}
